const SUPABASE_URL = 'https://diqmwmhamsfgstiycvtf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f15OX7M1w9ID5GHXNezGig_Bk0aoF-8';
const FROM_EMAIL = 'noreply@broadlanddigital.co.uk';
const SUPPLIER_EMAIL = 'chris@broadlanddigital.co.uk';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  })[character]);
}

function money(value) {
  return new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP' }).format(Number(value) || 0);
}

function displayDate(value) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle:'full', timeStyle:'short', timeZone:'Europe/London' }).format(new Date(value));
}

function optionRows(options) {
  return Object.entries(options || {}).filter(([, value]) => value !== '' && value != null).map(([label, value]) =>
    `<div style="margin-top:4px;color:#526173;font-size:13px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`
  ).join('');
}

function textOptions(options) {
  return Object.entries(options || {}).filter(([, value]) => value !== '' && value != null).map(([label, value]) =>
    `      ${label}: ${value}`
  ).join('\n');
}

function orderHtml(order, customerName, supplierCopy=false, hasLogo=false) {
  const exVatTotal = Number(order.subtotal || 0) + Number(order.delivery_cost || 0);
  const vat = exVatTotal * .2;
  const items = (order.order_items || []).map(item => `
    <tr>
      <td style="padding:16px 12px;border-bottom:1px solid #e3e8ee;vertical-align:top">
        <div style="font-weight:700;color:#102f50">${escapeHtml(item.title)}</div>
        <div style="margin-top:3px;color:#687789;font-size:13px">${escapeHtml(item.product_code)} · ${escapeHtml(item.category)}</div>
        ${optionRows(item.options)}
      </td>
      <td style="padding:16px 12px;border-bottom:1px solid #e3e8ee;text-align:center;vertical-align:top">${Number(item.quantity).toLocaleString('en-GB')}</td>
      <td style="padding:16px 12px;border-bottom:1px solid #e3e8ee;text-align:right;vertical-align:top;font-weight:700">${money(item.price)}</td>
    </tr>`).join('');
  const greeting = supplierCopy ? 'A new quote has been created through the Perenco portal.' : `Hello ${escapeHtml(customerName || 'there')},<br><br>Your quote has been created and is ready to view in the portal.`;
  const notes = order.notes ? `<tr><td style="padding:7px 0;color:#687789;width:145px">Quote notes</td><td style="padding:7px 0;color:#172c42">${escapeHtml(order.notes).replace(/\n/g,'<br>')}</td></tr>` : '';
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Perenco quote ${escapeHtml(order.order_number)}</title></head>
  <body style="margin:0;background:#f2f5f8;font-family:Arial,Helvetica,sans-serif;color:#172c42">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f8;padding:28px 12px"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(16,47,80,.10)">
        <tr><td style="background:#ffffff;padding:25px 30px;color:#102f50;border-bottom:1px solid #e3e8ee">${hasLogo ? '<img src="cid:broadland-logo" width="191" alt="Broadland Digital" style="display:block;width:191px;max-width:100%;height:auto;margin-left:auto">' : '<div style="font-size:24px;font-weight:800">Broadland Digital</div>'}<div style="margin-top:12px;color:#687789;font-size:13px;letter-spacing:.08em;text-transform:uppercase">Perenco quote</div></td></tr>
        <tr><td style="padding:30px">
          <p style="margin:0 0 24px;line-height:1.6">${greeting}</p>
          <div style="background:#eef4f8;border-left:4px solid #3976ad;border-radius:7px;padding:17px 19px;margin-bottom:25px">
            <div style="color:#687789;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Quote number</div>
            <div style="margin-top:4px;color:#102f50;font-size:22px;font-weight:800">${escapeHtml(order.order_number)}</div>
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;font-size:14px">
            <tr><td style="padding:7px 0;color:#687789;width:145px">Placed</td><td style="padding:7px 0;color:#172c42">${escapeHtml(displayDate(order.created_at))}</td></tr>
            <tr><td style="padding:7px 0;color:#687789">User</td><td style="padding:7px 0;color:#172c42">${escapeHtml(order.quote_contact_name || '')} (${escapeHtml(order.quote_contact_email || '')})</td></tr>
            <tr><td style="padding:7px 0;color:#687789">Branch login</td><td style="padding:7px 0;color:#172c42">${escapeHtml(order.customer_email)}</td></tr>
            <tr><td style="padding:7px 0;color:#687789;vertical-align:top">Delivery location</td><td style="padding:7px 0;color:#172c42">${escapeHtml(order.delivery_method || order.delivery_address).replace(/\n/g,'<br>')}</td></tr>
            ${notes}
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e3e8ee;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;font-size:14px">
            <thead><tr style="background:#f5f7fa;color:#526173"><th align="left" style="padding:12px">Product</th><th style="padding:12px">Qty</th><th align="right" style="padding:12px">Price</th></tr></thead>
            <tbody>${items}</tbody>
            <tfoot>
              <tr><td colspan="2" style="padding:12px;text-align:right;color:#526173">Products subtotal</td><td style="padding:12px;text-align:right">${money(order.subtotal)}</td></tr>
              <tr><td colspan="2" style="padding:12px;text-align:right;color:#526173">Delivery</td><td style="padding:12px;text-align:right">${money(order.delivery_cost)}</td></tr>
              <tr><td colspan="2" style="padding:12px;text-align:right;color:#526173">VAT 20%</td><td style="padding:12px;text-align:right">${money(vat)}</td></tr>
              <tr><td colspan="2" style="padding:16px 12px;text-align:right;border-top:1px solid #e3e8ee;font-weight:700">Quote total</td><td style="padding:16px 12px;text-align:right;border-top:1px solid #e3e8ee;color:#102f50;font-size:17px;font-weight:800">${escapeHtml(order.total_label || money(exVatTotal + vat))}</td></tr>
            </tfoot>
          </table>
          <p style="margin:26px 0 0;color:#687789;font-size:13px;line-height:1.55">${supplierCopy ? 'Sign in to the supplier administration area to review this quote.' : 'You can view and print the full quote in the Quotes section of your branch account.'}</p>
        </td></tr>
        <tr><td style="background:#e9eef3;padding:18px 30px;color:#687789;font-size:12px;line-height:1.5">Broadland Digital Limited · Unit 14 Vulcan House, Vulcan Road North, Norwich, NR6 6AQ · Company Registration No: 04802472.</td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

function orderText(order, customerName, supplierCopy=false) {
  const exVatTotal = Number(order.subtotal || 0) + Number(order.delivery_cost || 0);
  const vat = exVatTotal * .2;
  const lines = (order.order_items || []).map(item => {
    const options = textOptions(item.options);
    return `- ${item.title} (${item.product_code})\n  Quantity: ${item.quantity}\n  Price: ${money(item.price)}${options ? `\n${options}` : ''}`;
  }).join('\n\n');
  return `${supplierCopy ? 'A new quote has been created through the Perenco portal.' : `Hello ${customerName || 'there'},\n\nYour quote has been created.`}

Quote number: ${order.order_number}
Created: ${displayDate(order.created_at)}
User: ${order.quote_contact_name || ''} (${order.quote_contact_email || ''})
Branch login: ${order.customer_email}
Delivery location: ${order.delivery_method || order.delivery_address}
${order.notes ? `Quote notes: ${order.notes}\n` : ''}
${lines}

Products subtotal: ${money(order.subtotal)}
Delivery: ${money(order.delivery_cost)}
VAT 20%: ${money(vat)}
Quote total: ${order.total_label || money(exVatTotal + vat)}`;
}

function proofOfDeliveryHtml(order, hasLogo=false) {
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Proof of delivery ${escapeHtml(order.order_number)}</title></head>
  <body style="margin:0;background:#f2f5f8;font-family:Arial,Helvetica,sans-serif;color:#172c42">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f8;padding:28px 12px"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(16,47,80,.10)">
        <tr><td style="background:#ffffff;padding:25px 30px;color:#102f50;border-bottom:1px solid #e3e8ee">${hasLogo ? '<img src="cid:broadland-logo" width="191" alt="Broadland Digital" style="display:block;width:191px;max-width:100%;height:auto;margin-left:auto">' : '<div style="font-size:24px;font-weight:800">Broadland Digital</div>'}<div style="margin-top:12px;color:#687789;font-size:13px;letter-spacing:.08em;text-transform:uppercase">Proof of delivery</div></td></tr>
        <tr><td style="padding:30px">
          <p style="margin:0 0 22px;line-height:1.6">Hello,<br><br>Your proof of delivery has been uploaded and is attached to this email.</p>
          <div style="background:#eef4f8;border-left:4px solid #3976ad;border-radius:7px;padding:17px 19px">
            <div style="color:#687789;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Quote number</div>
            <div style="margin-top:4px;color:#102f50;font-size:22px;font-weight:800">${escapeHtml(order.order_number)}</div>
          </div>
          <p style="margin:22px 0 0;color:#687789;font-size:13px;line-height:1.55">Please retain the attached document for your records.</p>
        </td></tr>
        <tr><td style="background:#e9eef3;padding:18px 30px;color:#687789;font-size:12px;line-height:1.5">Broadland Digital Limited · Unit 14 Vulcan House, Vulcan Road North, Norwich, NR6 6AQ · Company Registration No: 04802472.</td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

function proofOfDeliveryText(order) {
  return `Hello,\n\nYour proof of delivery for quote ${order.order_number} has been uploaded and is attached to this email.\n\nPlease retain the attached document for your records.`;
}

function base64FromBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let offset=0; offset<bytes.length; offset+=8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return btoa(binary);
}

function asciiBytes(value) {
  return Uint8Array.from(String(value), character => character.charCodeAt(0) & 255);
}

function concatBytes(parts) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

function pdfSafe(value) {
  return String(value ?? '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/£/g, 'GBP ')
    .replace(/[\u2013\u2014]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\x7e]/g, '?')
    .replace(/([\\()])/g, '\\$1');
}

function pdfDate(value) {
  return new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'Europe/London' }).format(new Date(value));
}

function pdfAmount(value) {
  return new Intl.NumberFormat('en-GB', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(Number(value) || 0);
}

function wrapPdfText(value, maxLength=54) {
  const words = pdfSafe(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line || (line + ' ' + word).length <= maxLength) line += (line ? ' ' : '') + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function parsePngForPdf(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const signature = [137,80,78,71,13,10,26,10];
  if (!signature.every((value, index) => bytes[index] === value)) throw new Error('Quote logo is not a PNG.');
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(0);
      height = new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    offset += 12 + length;
  }
  if (!width || !height || bitDepth !== 8 || colorType !== 2 || !idat.length) throw new Error('Quote logo PNG must be 8-bit RGB.');
  return { width, height, data:concatBytes(idat) };
}

function buildPdf(objects) {
  const parts = [asciiBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  const offsets = [0];
  let length = parts[0].length;
  for (let index=1; index<objects.length; index += 1) {
    offsets[index] = length;
    const object = concatBytes([asciiBytes(`${index} 0 obj\n`), objects[index], asciiBytes('\nendobj\n')]);
    parts.push(object);
    length += object.length;
  }
  const xrefOffset = length;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let index=1; index<objects.length; index += 1) xref += String(offsets[index]).padStart(10,'0') + ' 00000 n \n';
  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(asciiBytes(xref));
  return concatBytes(parts);
}

function streamObject(dictionary, data) {
  return concatBytes([asciiBytes(`<< ${dictionary} /Length ${data.length} >>\nstream\n`), data, asciiBytes('\nendstream')]);
}

function generateQuotePdf(order, logoBytes) {
  const logo = parsePngForPdf(logoBytes);
  const items = (order.order_items || []).map(item => ({ ...item, isDelivery:false }));
  if (Number(order.delivery_cost || 0) > 0) items.push({
    title:`Delivery - ${order.delivery_method || order.delivery_address || ''}`,
    product_code:'DELIVERY', quantity:1, price:Number(order.delivery_cost || 0), options:{}, isDelivery:true
  });
  const pageItems = [];
  for (let offset=0; offset<items.length; offset += 7) pageItems.push(items.slice(offset, offset + 7));
  if (!pageItems.length) pageItems.push([]);

  const objects = new Array(6 + pageItems.length * 2);
  objects[1] = asciiBytes('<< /Type /Catalog /Pages 2 0 R >>');
  objects[3] = asciiBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  objects[4] = asciiBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  objects[5] = streamObject(`/Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns ${logo.width} >>`, logo.data);

  const pageRefs = [];
  const exVatTotal = Number(order.subtotal || 0) + Number(order.delivery_cost || 0);
  const vat = exVatTotal * .2;
  const total = exVatTotal + vat;
  const created = new Date(order.created_at);
  const expiry = order.quote_valid_until ? new Date(order.quote_valid_until + 'T12:00:00Z') : new Date(created.getTime() + 30 * 86400000);
  const text = (commands, x, y, size, value, bold=false) => commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${y} Td (${pdfSafe(value)}) Tj ET`);
  const rightText = (commands, right, y, size, value, bold=false) => {
    const safe = pdfSafe(value);
    text(commands, Math.max(30, right - safe.length * size * .5), y, size, safe, bold);
  };
  const line = (commands, x1, y1, x2, y2, width=.6) => commands.push(`${width} w ${x1} ${y1} m ${x2} ${y2} l S`);

  pageItems.forEach((pageRows, pageIndex) => {
    const commands = [];
    const isFirst = pageIndex === 0;
    const isLast = pageIndex === pageItems.length - 1;
    commands.push('q 122 0 0 80 425 730 cm /Im1 Do Q');
    if (isFirst) {
      text(commands,48,704,29,'QUOTE',false);
      text(commands,78,676,10,'PERENCO UK LIMITED',true);
      text(commands,78,660,9,order.delivery_method || order.delivery_address || '');
      text(commands,78,638,9,'For: ' + (order.quote_contact_name || ''));
      text(commands,78,625,9,order.quote_contact_email || '');
      text(commands,344,687,9,'Date',true); text(commands,344,675,9,pdfDate(created));
      text(commands,344,653,9,'Expiry',true); text(commands,344,641,9,pdfDate(expiry));
      text(commands,344,619,9,'Quote Number',true); text(commands,344,607,9,order.order_number);
      text(commands,344,585,9,'Reference',true); text(commands,344,573,8,order.quote_contact_name || order.quote_contact_email || 'Perenco portal');
      text(commands,344,551,9,'VAT Number',true); text(commands,344,539,9,'825861607');
      text(commands,425,694,9,'Broadland Digital Limited',true);
      text(commands,425,681,9,'Unit 14 Vulcan House');
      text(commands,425,668,9,'Vulcan Road North');
      text(commands,425,655,9,'Norwich');
      text(commands,425,642,9,'NR6 6AQ');
    } else {
      text(commands,48,780,18,'QUOTE ' + order.order_number,true);
      text(commands,48,762,8,'Continued - page ' + (pageIndex + 1));
    }

    let y = isFirst ? 500 : 730;
    text(commands,48,y,8,'Description',true);
    rightText(commands,360,y,8,'Quantity',true);
    rightText(commands,445,y,8,'Unit Price',true);
    text(commands,468,y,8,'VAT',true);
    rightText(commands,548,y,8,'Amount GBP',true);
    line(commands,48,y-7,548,y-7,1);
    y -= 28;

    for (const item of pageRows) {
      const titleLines = wrapPdfText(item.title,48).slice(0,2);
      titleLines.forEach((value,index) => text(commands,50,y-index*11,8.5,value,index===0));
      if (item.product_code) text(commands,50,y-titleLines.length*11,7,item.product_code);
      const amount = item.price == null ? null : Number(item.price);
      const unit = amount == null ? null : amount / Math.max(1,Number(item.quantity || 1));
      rightText(commands,360,y,8.5,Number(item.quantity || 0).toLocaleString('en-GB'));
      rightText(commands,445,y,8.5,amount == null ? 'TBC' : pdfAmount(unit));
      rightText(commands,490,y,8.5,'20%');
      rightText(commands,548,y,8.5,amount == null ? 'TBC' : pdfAmount(amount));
      y -= 38;
      line(commands,48,y+11,548,y+11,.25);
    }

    if (isLast) {
      const pending = (order.order_items || []).some(item => item.price == null) ? ' + prices TBC' : '';
      y -= 4;
      text(commands,48,y,8,'All prices are exclusive of VAT, which will be charged at the');
      text(commands,48,y-11,8,'current prevailing rate.');
      rightText(commands,410,y,9,'Subtotal'); rightText(commands,548,y,9,pdfAmount(exVatTotal) + pending);
      rightText(commands,410,y-22,9,'TOTAL VAT 20%'); rightText(commands,548,y-22,9,pdfAmount(vat) + pending);
      line(commands,330,y-34,548,y-34,.7);
      rightText(commands,410,y-50,10,'TOTAL GBP',true); rightText(commands,548,y-50,10,order.total_label || pdfAmount(total),true);
      line(commands,330,y-61,548,y-61,.9);

      const termsY = Math.min(y - 95, 188);
      text(commands,48,termsY,8.5,'Terms',true); line(commands,48,termsY-8,548,termsY-8,.6);
      text(commands,48,termsY-25,7.3,'Payment on receipt of invoice or 30 days net when on account.');
      text(commands,48,termsY-40,7.3,'Bank Transfer to: Lloyds Bank Acc No: 04213365  Sort Code: 30-96-17');
      text(commands,48,termsY-56,7.3,'Unless queries are raised within 7 days of receipt of any invoice, it shall be taken that services and good');
      text(commands,48,termsY-67,7.3,'have been received as stated and full paymentwill be made as per our terms.');
      text(commands,48,termsY-83,7.3,'The company reserves the right to charge interest on overdue accounts using the Late Payment of Commercial');
      text(commands,48,termsY-94,7.3,'Debts (interest) Act. Design work iscovered by copyright law.');
      text(commands,48,termsY-105,7.3,'Full terms and conditions are available at broadlanddigital.co.uk');
    }
    text(commands,48,28,6.8,'Company Registration No: 04802472. Registered Office: Unit 14 Vulcan House, Vulcan Road North, Norwich, NR6 6AQ.');

    const pageObject = 6 + pageIndex * 2;
    const contentObject = pageObject + 1;
    pageRefs.push(pageObject + ' 0 R');
    objects[pageObject] = asciiBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Im1 5 0 R >> >> /Contents ${contentObject} 0 R >>`);
    const content = asciiBytes(commands.join('\n'));
    objects[contentObject] = streamObject('',content);
  });
  objects[2] = asciiBytes(`<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs.join(' ')}] >>`);
  return buildPdf(objects);
}

async function sendEmail(env, to, subject, html, text, logoContent='', quotePdfContent='', quoteNumber='quote', extraAttachments=[], replyTo='') {
  if (!env.SENDGRID_API_KEY) throw new Error('Email service is not configured.');
  const attachments = [];
  if (logoContent) attachments.push({ content:logoContent, filename:'broadland-digital-logo.png', type:'image/png', disposition:'inline', content_id:'broadland-logo' });
  if (quotePdfContent) attachments.push({ content:quotePdfContent, filename:pdfSafe(quoteNumber) + '.pdf', type:'application/pdf', disposition:'attachment' });
  attachments.push(...extraAttachments);
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${env.SENDGRID_API_KEY}`, 'Content-Type':'application/json' },
    body:JSON.stringify({
      personalizations:[{ to:[{ email:to }] }],
      from:{ email:FROM_EMAIL, name:'Broadland Digital Quotes' },
      subject,
      ...(replyTo ? { reply_to:{ email:replyTo } } : {}),
      content:[{ type:'text/plain', value:text }, { type:'text/html', value:html }],
      ...(attachments.length ? { attachments } : {})
    })
  });
  if (!response.ok) throw new Error(`SendGrid returned ${response.status}.`);
}

async function handleProofOfDelivery(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return Response.json({ message:'You must be signed in.' }, { status:401 });

  const authHeaders = { apikey:SUPABASE_KEY, Authorization:authorization };
  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers:authHeaders });
  if (!authResponse.ok) return Response.json({ message:'Your session could not be verified.' }, { status:401 });
  const user = await authResponse.json();
  let isAdmin = user.app_metadata?.role === 'supplier_admin';
  if (!isAdmin) {
    const profileQuery = new URLSearchParams({ select:'role', id:`eq.${user.id}`, limit:'1' });
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${profileQuery}`, { headers:authHeaders });
    if (profileResponse.ok) {
      const [profile] = await profileResponse.json();
      isAdmin = profile?.role === 'supplier_admin';
    }
  }
  if (!isAdmin) return Response.json({ message:'Supplier administrator access is required.' }, { status:403 });

  const body = await request.json().catch(() => ({}));
  if (!/^(?:QU-\d+|PER-\d{4}-\d{6})$/.test(body.orderNumber || '')) return Response.json({ message:'A valid quote number is required.' }, { status:400 });

  const orderQuery = new URLSearchParams({ select:'*', order_number:`eq.${body.orderNumber}`, limit:'1' });
  const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?${orderQuery}`, { headers:authHeaders });
  if (!orderResponse.ok) return Response.json({ message:'The saved order could not be loaded.' }, { status:502 });
  const [order] = await orderResponse.json();
  if (!order?.customer_email) return Response.json({ message:'The email address that placed this order could not be found.' }, { status:404 });

  const fileQuery = new URLSearchParams({ select:'*', order_id:`eq.${order.id}`, kind:'eq.proof_of_delivery', order:'created_at.desc', limit:'1' });
  const fileResponse = await fetch(`${SUPABASE_URL}/rest/v1/order_files?${fileQuery}`, { headers:authHeaders });
  if (!fileResponse.ok) return Response.json({ message:'The proof of delivery record could not be loaded.' }, { status:502 });
  const [proofFile] = await fileResponse.json();
  if (!proofFile?.storage_path) return Response.json({ message:'The uploaded proof of delivery could not be found.' }, { status:404 });

  const encodedPath = proofFile.storage_path.split('/').map(encodeURIComponent).join('/');
  const signResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/order-files/${encodedPath}`, {
    method:'POST', headers:{ ...authHeaders, 'Content-Type':'application/json' }, body:JSON.stringify({ expiresIn:120 })
  });
  const signed = await signResponse.json().catch(() => ({}));
  if (!signResponse.ok || !signed.signedURL) return Response.json({ message:'The uploaded proof of delivery could not be opened.' }, { status:502 });
  const attachmentResponse = await fetch(`${SUPABASE_URL}/storage/v1${signed.signedURL}`);
  if (!attachmentResponse.ok) return Response.json({ message:'The uploaded proof of delivery could not be downloaded.' }, { status:502 });
  const attachmentBuffer = await attachmentResponse.arrayBuffer();
  if (attachmentBuffer.byteLength > 20 * 1024 * 1024) return Response.json({ message:'The proof of delivery is too large to email. Upload a file smaller than 20 MB.' }, { status:413 });

  let logoContent = '';
  if (env.ASSETS?.fetch) {
    const logoResponse = await env.ASSETS.fetch(new Request(new URL('/broadland-digital-logo.png', request.url)));
    if (logoResponse.ok) logoContent = base64FromBuffer(await logoResponse.arrayBuffer());
  }
  const fileName = String(proofFile.file_name || 'proof-of-delivery').replace(/[\r\n"\\]/g, '-').slice(0,180) || 'proof-of-delivery';
  const mimeType = /^[\w.+-]+\/[\w.+-]+$/.test(proofFile.mime_type || '') ? proofFile.mime_type : 'application/octet-stream';
  await sendEmail(
    env,
    order.customer_email,
    `Proof of delivery – ${order.order_number}`,
    proofOfDeliveryHtml(order, Boolean(logoContent)),
    proofOfDeliveryText(order),
    logoContent,
    '',
    order.order_number,
    [{ content:base64FromBuffer(attachmentBuffer), filename:fileName, type:mimeType, disposition:'attachment' }]
  );
  return Response.json({ sent:true, recipient:order.customer_email });
}

async function handleOrderConfirmation(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return Response.json({ message:'You must be signed in.' }, { status:401 });

  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers:{ apikey:SUPABASE_KEY, Authorization:authorization } });
  if (!authResponse.ok) return Response.json({ message:'Your session could not be verified.' }, { status:401 });
  const user = await authResponse.json();
  const body = await request.json().catch(() => ({}));
  if (!/^(?:QU-\d+|PER-\d{4}-\d{6})$/.test(body.orderNumber || '')) return Response.json({ message:'A valid quote number is required.' }, { status:400 });

  const query = new URLSearchParams({
    select:'*,order_items(*)',
    order_number:`eq.${body.orderNumber}`,
    customer_id:`eq.${user.id}`,
    limit:'1'
  });
  const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?${query}`, { headers:{ apikey:SUPABASE_KEY, Authorization:authorization } });
  if (!orderResponse.ok) return Response.json({ message:'The saved order could not be loaded.' }, { status:502 });
  const [order] = await orderResponse.json();
  if (!order || order.customer_email !== user.email) return Response.json({ message:'The quote could not be verified.' }, { status:404 });

  const metadata = user.user_metadata || {};
  const customerName = order.quote_contact_name || metadata.full_name || [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user.email.split('@')[0];
  const customerEmail = order.quote_contact_email || user.email;
  const customerSubject = `Perenco quote – ${order.order_number}`;
  const supplierSubject = `New Perenco quote – ${order.order_number}`;
  let logoContent = '';
  let quotePdfContent = '';
  if (env.ASSETS?.fetch) {
    const logoUrl = new URL('/broadland-digital-logo.png', request.url);
    const logoResponse = await env.ASSETS.fetch(new Request(logoUrl));
    if (!logoResponse.ok) throw new Error('The quote logo could not be loaded.');
    const logoBuffer = await logoResponse.arrayBuffer();
    logoContent = base64FromBuffer(logoBuffer);
    quotePdfContent = base64FromBuffer(generateQuotePdf(order, new Uint8Array(logoBuffer)));
  }
  if (!quotePdfContent) throw new Error('The quote PDF could not be generated.');
  await Promise.all([
    sendEmail(env, customerEmail, customerSubject, orderHtml(order, customerName, false, Boolean(logoContent)), orderText(order, customerName), logoContent, quotePdfContent, order.order_number),
    sendEmail(env, SUPPLIER_EMAIL, supplierSubject, orderHtml(order, customerName, true, Boolean(logoContent)), orderText(order, customerName, true), logoContent, quotePdfContent, order.order_number)
  ]);
  return Response.json({ sent:true });
}

function enquiryHtml(enquiry, supplierCopy=false, hasLogo=false) {
  const greeting = supplierCopy
    ? 'A new bespoke quote request has been submitted through the Perenco portal.'
    : `Hello ${escapeHtml(enquiry.name || 'there')},<br><br>Thank you for your bespoke quote request. We have received the details below and will be in touch with a quote.`;
  const row = (label, value) => `<tr><td style="padding:7px 0;color:#687789;width:145px;vertical-align:top">${label}</td><td style="padding:7px 0;color:#172c42">${value}</td></tr>`;
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bespoke quote request</title></head>
  <body style="margin:0;background:#f2f5f8;font-family:Arial,Helvetica,sans-serif;color:#172c42">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f8;padding:28px 12px"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(16,47,80,.10)">
        <tr><td style="background:#ffffff;padding:25px 30px;color:#102f50;border-bottom:1px solid #e3e8ee">${hasLogo ? '<img src="cid:broadland-logo" width="191" alt="Broadland Digital" style="display:block;width:191px;max-width:100%;height:auto;margin-left:auto">' : '<div style="font-size:24px;font-weight:800">Broadland Digital</div>'}<div style="margin-top:12px;color:#687789;font-size:13px;letter-spacing:.08em;text-transform:uppercase">Perenco bespoke quote request</div></td></tr>
        <tr><td style="padding:30px">
          <p style="margin:0 0 24px;line-height:1.6">${greeting}</p>
          <div style="background:#eef4f8;border-left:4px solid #3976ad;border-radius:7px;padding:17px 19px;margin-bottom:25px">
            <div style="color:#687789;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Request</div>
            <div style="margin-top:4px;color:#102f50;font-size:19px;font-weight:800">${escapeHtml(enquiry.subject)}</div>
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px">
            ${row('Submitted', escapeHtml(displayDate(enquiry.created_at)))}
            ${row('Name', escapeHtml(enquiry.name))}
            ${row('Email', escapeHtml(enquiry.email))}
            ${supplierCopy ? row('Branch login', escapeHtml(enquiry.branch_email || '')) : ''}
            ${row('Details', escapeHtml(enquiry.details || '').replace(/\n/g,'<br>'))}
          </table>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

function enquiryText(enquiry, supplierCopy=false) {
  return [
    supplierCopy ? 'A new bespoke quote request has been submitted through the Perenco portal.' : `Hello ${enquiry.name || 'there'},\n\nThank you for your bespoke quote request. We have received the details below and will be in touch with a quote.`,
    '',
    `Request: ${enquiry.subject}`,
    `Submitted: ${displayDate(enquiry.created_at)}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    ...(supplierCopy ? [`Branch login: ${enquiry.branch_email || ''}`] : []),
    '',
    enquiry.details || ''
  ].join('\n');
}

async function handleEnquiryNotification(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return Response.json({ message:'You must be signed in.' }, { status:401 });
  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers:{ apikey:SUPABASE_KEY, Authorization:authorization } });
  if (!authResponse.ok) return Response.json({ message:'Your session could not be verified.' }, { status:401 });
  const user = await authResponse.json();
  const body = await request.json().catch(() => ({}));
  if (!/^[0-9a-f-]{36}$/i.test(body.enquiryId || '')) return Response.json({ message:'A valid enquiry is required.' }, { status:400 });

  const query = new URLSearchParams({ select:'*', id:`eq.${body.enquiryId}`, user_id:`eq.${user.id}`, limit:'1' });
  const enquiryResponse = await fetch(`${SUPABASE_URL}/rest/v1/enquiries?${query}`, { headers:{ apikey:SUPABASE_KEY, Authorization:authorization } });
  if (!enquiryResponse.ok) return Response.json({ message:'The saved enquiry could not be loaded.' }, { status:502 });
  const enquiry = (await enquiryResponse.json())[0];
  if (!enquiry) return Response.json({ message:'Enquiry not found.' }, { status:404 });
  enquiry.branch_email = user.email || '';

  let logoContent = '';
  if (env.ASSETS?.fetch) {
    const logoResponse = await env.ASSETS.fetch(new Request(new URL('/broadland-digital-logo.png', request.url)));
    if (logoResponse.ok) logoContent = base64FromBuffer(await logoResponse.arrayBuffer());
  }
  const hasLogo = Boolean(logoContent);
  const customerEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email || '') ? enquiry.email : user.email;
  await Promise.all([
    sendEmail(env, SUPPLIER_EMAIL, `New bespoke quote request: ${enquiry.subject}`, enquiryHtml(enquiry, true, hasLogo), enquiryText(enquiry, true), logoContent, '', 'quote', [], customerEmail),
    sendEmail(env, customerEmail, 'Your Perenco bespoke quote request', enquiryHtml(enquiry, false, hasLogo), enquiryText(enquiry, false), logoContent)
  ]);
  return Response.json({ sent:true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/quote-confirmation' || url.pathname === '/api/order-confirmation') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status:405, headers:{ Allow:'POST' } });
      try { return await handleOrderConfirmation(request, env); }
      catch (error) {
        console.error('Quote confirmation error', error);
        return Response.json({ message:'The quote confirmation emails could not be sent.' }, { status:502 });
      }
    }
    if (url.pathname === '/api/enquiry-notification') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status:405, headers:{ Allow:'POST' } });
      try { return await handleEnquiryNotification(request, env); }
      catch (error) {
        console.error('Enquiry notification error', error);
        return Response.json({ message:'Your request was saved, but the notification email could not be sent.' }, { status:502 });
      }
    }
    if (url.pathname === '/api/proof-of-delivery') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status:405, headers:{ Allow:'POST' } });
      try { return await handleProofOfDelivery(request, env); }
      catch (error) {
        console.error('Proof of delivery email error', error);
        return Response.json({ message:'The proof of delivery was uploaded, but its email could not be sent.' }, { status:502 });
      }
    }
    if (env.ASSETS?.fetch) {
      let response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.split('/').pop().includes('.')) {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = url.pathname.replace(/\/$/, '') + '/index.html';
        response = await env.ASSETS.fetch(new Request(assetUrl, request));
      }
      return response;
    }
    return new Response('Not found', { status:404 });
  }
};
