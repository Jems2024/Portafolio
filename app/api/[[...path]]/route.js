import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'jared_duron_portfolio'
const contactToEmail = process.env.CONTACT_TO_EMAIL || 'jaredmisaelduron@gmail.com'

let cachedClient = null
async function getDb() {
  if (cachedClient) return cachedClient.db(dbName)
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client.db(dbName)
}

function cors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('Email service is not configured')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  })
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildContactEmail(doc) {
  const rows = [
    ['Nombre', doc.name],
    ['Email', doc.email],
    ['Telefono', doc.phone || 'No indicado'],
    ['Empresa', doc.company || 'No indicada'],
    ['Presupuesto', doc.budget || 'No indicado'],
    ['Tipo de proyecto', doc.projectType || 'No indicado'],
    ['Idioma', doc.locale],
    ['Fecha', doc.createdAt],
  ]

  const text = [
    'Nuevo mensaje desde el formulario de jaredduron.com',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Mensaje:',
    doc.message,
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
        <div style="white-space:pre-wrap;background:#f6f6f6;padding:14px;border-radius:8px">${escapeHtml(doc.message)}</div>
      </div>
    </div>
  `

  return { text, html }
}

function buildAutoReplyEmail(doc) {
  const isEn = doc.locale === 'en'
  const isCa = doc.locale === 'ca'

  const subject = isEn
    ? `Jared Durón — I have received your inquiry`
    : isCa
      ? `Jared Durón — He rebut la teva consulta`
      : `Jared Durón — He recibido tu consulta`

  const title = isEn
    ? `Thank you for reaching out, ${escapeHtml(doc.name)}!`
    : isCa
      ? `Gràcies per posar-te en contacte, ${escapeHtml(doc.name)}!`
      : `¡Gracias por contactarme, ${escapeHtml(doc.name)}!`

  const p1 = isEn
    ? `I have received your inquiry regarding <strong>${escapeHtml(doc.projectType || 'your project')}</strong>.`
    : isCa
      ? `He rebut la teva consulta sobre <strong>${escapeHtml(doc.projectType || 'el teu projecte')}</strong>.`
      : `He recibido correctamente la información para <strong>${escapeHtml(doc.projectType || 'tu proyecto')}</strong>.`

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
    <div style="background-color:#0D1B2A;padding:32px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#E0E1DD;line-height:1.6">
      <div style="max-width:560px;margin:0 auto;background-color:#1B263B;border:1px solid rgba(65,90,119,0.5);border-radius:0px;padding:32px;box-shadow:0 20px 50px rgba(0,0,0,0.5)">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#778DA9;text-transform:uppercase;margin-bottom:12px">JARED DURÓN · FILMMAKER</div>
        <h1 style="font-size:22px;font-weight:700;color:#E0E1DD;margin:0 0 20px;line-height:1.3">${title}</h1>
        <p style="font-size:15px;color:#778DA9;margin-bottom:16px">${p1}</p>
        <p style="font-size:15px;color:#778DA9;margin-bottom:28px">${p2}</p>
        <div style="padding:16px 20px;background-color:rgba(13,27,42,0.6);border-left:3px solid #415A77;border-radius:0px;margin-bottom:28px">
          <div style="font-size:13px;color:#778DA9;margin-bottom:4px">${isEn ? 'Direct Contact' : isCa ? 'Contacte Directe' : 'Contacto Directo'}</div>
          <div style="font-size:14px;color:#E0E1DD;font-weight:600">WhatsApp: +34 637 43 42 35 · jaredmisaelduron@gmail.com</div>
        </div>
        <a href="https://wa.me/34637434235" style="display:inline-block;background-color:#E0E1DD;color:#0D1B2A;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;padding:14px 28px;border-radius:0px;text-decoration:none">
          ${isEn ? 'Chat via WhatsApp' : isCa ? 'Xat per WhatsApp' : 'Hablar por WhatsApp'}
        </a>
      </div>
      <div style="text-align:center;margin-top:24px;font-size:12px;color:#778DA9">
        © ${new Date().getFullYear()} Jared Durón · Barcelona, Spain
      </div>
    </div>
  `

  return { subject, text, html }
}

async function sendContactEmail(doc) {
  const transporter = getSmtpTransport()
  const { text, html } = buildContactEmail(doc)
  const from = process.env.SMTP_FROM || process.env.SMTP_USER

  await transporter.sendMail({
    from,
    to: contactToEmail,
    replyTo: doc.email,
    subject: `Nuevo lead: ${doc.name}`,
    text,
    html,
  })

  // Send Auto-reply to lead
  try {
    const autoReply = buildAutoReplyEmail(doc)
    await transporter.sendMail({
      from,
      to: doc.email,
      subject: autoReply.subject,
      text: autoReply.text,
      html: autoReply.html,
    })
  } catch (autoReplyErr) {
    console.error('Auto reply email error:', autoReplyErr)
  }
}

export async function GET(request, context) {
  const params = await context.params
  const path = (params?.path || []).join('/')
  try {
    if (path === '' || path === 'health') {
      return cors(NextResponse.json({ ok: true, service: 'jared-duron-portfolio' }))
    }
    return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }))
  } catch (e) {
    return cors(NextResponse.json({ error: e.message }, { status: 500 }))
  }
}

export async function POST(request, context) {
  const params = await context.params
  const path = (params?.path || []).join('/')
  try {
    const body = await request.json().catch(() => ({}))
    if (path === 'contact') {
      const { name, email, phone, company, budget, projectType, message, locale } = body
      if (!name || !email || !message) {
        return cors(NextResponse.json({ error: 'Missing required fields' }, { status: 400 }))
      }
      const db = await getDb()
      const doc = {
        id: uuidv4(),
        name,
        email,
        phone: phone || null,
        company: company || null,
        budget: budget || null,
        projectType: projectType || null,
        message,
        locale: locale || 'es',
        createdAt: new Date().toISOString(),
        emailTo: contactToEmail,
        emailSent: false,
      }
      await db.collection('contact_leads').insertOne(doc)
      try {
        await sendContactEmail(doc)
        await db.collection('contact_leads').updateOne({ id: doc.id }, { $set: { emailSent: true } })
      } catch (emailError) {
        await db.collection('contact_leads').updateOne(
          { id: doc.id },
          { $set: { emailError: emailError.message, emailErrorAt: new Date().toISOString() } }
        )
        return cors(NextResponse.json({
          error: 'Contact email could not be sent',
          leadSaved: true,
          id: doc.id,
        }, { status: 500 }))
      }
      return cors(NextResponse.json({ ok: true, id: doc.id, emailTo: contactToEmail, autoReplySent: true }))
    }
    return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }))
  } catch (e) {
    return cors(NextResponse.json({ error: e.message }, { status: 500 }))
  }
}
