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

function buildAutoReplyEmail(contact) {
  const isEn = contact.locale === 'en'
  const isCa = contact.locale === 'ca'

  const subject = isEn
    ? `Jared Durón — I have received your inquiry`
    : isCa
      ? `Jared Durón — He rebut la teva consulta`
      : `Jared Durón — He recibido tu consulta`

  const title = isEn
    ? `Thank you for reaching out, ${escapeHtml(contact.name)}!`
    : isCa
      ? `Gràcies per posar-te en contacte, ${escapeHtml(contact.name)}!`
      : `¡Gracias por contactarme, ${escapeHtml(contact.name)}!`

  const p1 = isEn
    ? `I have received your inquiry regarding <strong>${escapeHtml(contact.projectType || 'your project')}</strong>.`
    : isCa
      ? `He rebut la teva consulta sobre <strong>${escapeHtml(contact.projectType || 'el teu projecte')}</strong>.`
      : `He recibido correctamente la información para <strong>${escapeHtml(contact.projectType || 'tu proyecto')}</strong>.`

  const p2 = isEn
    ? `I will review your requirements, budget and timelines, and get back to you within 24 hours to schedule a call or proposal.`
    : isCa
      ? `Revisaré la informació (pressupost, requisits i terminis) i em posaré en contacte amb tu en menys de 24 hores.`
      : `Revisaré detalladamente la información brindada (presupuesto, concepto y requerimientos) y me pondré en contacto contigo en menos de 24 horas para definir los siguientes pasos.`

  const text = [
    subject,
    '',
    p1.replace(/<[^>]+>/g, ''),
    p2,
    '',
    'Jared Durón | Filmmaker & Graphic Designer · Barcelona',
    'WhatsApp: +34 637 43 42 35 | Email: jaredmisaelduron@gmail.com',
  ].join('\n')

  const html = `
    <div style="background-color:#06080F;padding:32px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F5F5F4;line-height:1.6">
      <div style="max-width:560px;margin:0 auto;background-color:#0E1322;border:1px solid rgba(245,197,24,0.3);border-radius:16px;padding:32px;box-shadow:0 20px 50px rgba(0,0,0,0.5)">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#F5C518;text-transform:uppercase;margin-bottom:12px">JARED DURÓN · FILMMAKER</div>
        <h1 style="font-size:22px;font-weight:700;color:#FFFFFF;margin:0 0 20px;line-height:1.3">${title}</h1>
        <p style="font-size:15px;color:#D1D5DB;margin-bottom:16px">${p1}</p>
        <p style="font-size:15px;color:#D1D5DB;margin-bottom:28px">${p2}</p>
        <div style="padding:16px 20px;background-color:rgba(245,197,24,0.06);border-left:3px solid #F5C518;border-radius:8px;margin-bottom:28px">
          <div style="font-size:13px;color:#9CA3AF;margin-bottom:4px">${isEn ? 'Direct Contact' : isCa ? 'Contacte Directe' : 'Contacto Directo'}</div>
          <div style="font-size:14px;color:#F5C518;font-weight:600">WhatsApp: +34 637 43 42 35 · jaredmisaelduron@gmail.com</div>
        </div>
        <a href="https://wa.me/34637434235" style="display:inline-block;background-color:#F5C518;color:#06080F;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;padding:14px 28px;border-radius:9999px;text-decoration:none">
          ${isEn ? 'Chat via WhatsApp' : isCa ? 'Xat per WhatsApp' : 'Hablar por WhatsApp'}
        </a>
      </div>
      <div style="text-align:center;margin-top:24px;font-size:12px;color:#6B7280">
        © ${new Date().getFullYear()} Jared Durón · Barcelona, Spain
      </div>
    </div>
  `

  return { subject, text, html }
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

    // Auto-responder confirmation to the user
    try {
      const autoReply = buildAutoReplyEmail(contact)
      await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [contact.email],
          subject: autoReply.subject,
          text: autoReply.text,
          html: autoReply.html,
        }),
      })
    } catch (autoReplyErr) {
      console.error('Auto-reply email sending failed:', autoReplyErr)
    }

    return json({ ok: true, id: payload?.id || null, autoReplySent: true })
  } catch (error) {
    return json({
      error: 'Contact email request failed',
      detail: error.message,
    }, 500)
  }
}
