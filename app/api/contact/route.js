import { NextResponse } from 'next/server'

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_EMAIL_FROM = 'Portfolio <onboarding@resend.dev>'

function json(data, status = 200) {
  return NextResponse.json(data, { status })
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function firstValue(body, keys) {
  for (const key of keys) {
    if (body?.[key] !== undefined && body?.[key] !== null) {
      return String(body[key]).trim()
    }
  }
  return ''
}

function normalizeContact(body) {
  return {
    name: firstValue(body, ['name', 'nombre']),
    email: firstValue(body, ['email']),
    message: firstValue(body, ['message', 'mensaje']),
    company: firstValue(body, ['company', 'empresa']),
    phone: firstValue(body, ['phone', 'telefono', 'teléfono']),
    budget: firstValue(body, ['budget', 'presupuesto']),
    projectType: firstValue(body, ['projectType', 'tipoProyecto', 'tipo_proyecto']),
    locale: firstValue(body, ['locale']) || 'es',
  }
}

function buildEmail(contact) {
  const rows = [
    ['Nombre', contact.name],
    ['Email', contact.email],
    ['Empresa', contact.company || 'No indicada'],
    ['Telefono', contact.phone || 'No indicado'],
    ['Presupuesto', contact.budget || 'No indicado'],
    ['Tipo de proyecto', contact.projectType || 'No indicado'],
    ['Idioma', contact.locale],
  ]

  const text = [
    'Nuevo mensaje desde el formulario del portfolio',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Mensaje:',
    contact.message,
  ].join('\n')

  const htmlRows = rows.map(([label, value]) => (
    `<tr><td style="padding:6px 12px 6px 0;color:#666">${escapeHtml(label)}</td><td style="padding:6px 0;color:#111">${escapeHtml(value)}</td></tr>`
  )).join('')

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px">Nuevo mensaje desde el formulario</h2>
      <table style="border-collapse:collapse;margin-bottom:18px">${htmlRows}</table>
      <div style="margin-top:18px">
        <div style="font-weight:bold;margin-bottom:8px">Mensaje</div>
        <div style="white-space:pre-wrap;background:#f6f6f6;padding:14px;border-radius:8px">${escapeHtml(contact.message)}</div>
      </div>
    </div>
  `

  return { text, html }
}

function readableResendError(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload
  return payload.message || payload.error || payload.name || fallback
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const contactToEmail = process.env.CONTACT_TO_EMAIL
  const emailFrom = process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM
  const contact = normalizeContact(body)

  if (!resendApiKey) {
    return json({ error: 'Missing RESEND_API_KEY server environment variable' }, 500)
  }

  if (!contactToEmail) {
    return json({ error: 'Missing CONTACT_TO_EMAIL server environment variable' }, 500)
  }

  if (!contact.name || !contact.email || !contact.message) {
    return json({ error: 'Missing required fields: name, email and message are required' }, 400)
  }

  const { text, html } = buildEmail(contact)

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [contactToEmail],
        reply_to: contact.email,
        subject: `Nuevo lead del portfolio: ${contact.name}`,
        text,
        html,
      }),
    })

    const payload = await resendResponse.json().catch(() => null)

    if (!resendResponse.ok) {
      return json({
        error: 'Resend could not send the contact email',
        detail: readableResendError(payload, `Resend returned status ${resendResponse.status}`),
      }, 502)
    }

    return json({ ok: true, id: payload?.id || null })
  } catch (error) {
    return json({
      error: 'Contact email request failed',
      detail: error.message,
    }, 500)
  }
}
