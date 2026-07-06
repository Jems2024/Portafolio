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
      return cors(NextResponse.json({ ok: true, id: doc.id, emailTo: contactToEmail }))
    }
    return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }))
  } catch (e) {
    return cors(NextResponse.json({ error: e.message }, { status: 500 }))
  }
}
