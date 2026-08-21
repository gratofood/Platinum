import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const token = process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const webAppUrl = process.env.WEBAPP_URL || 'https://your-mini-app.vercel.app';
const adminChatId = process.env.ADMIN_CHAT_ID;

if (token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
  console.log('⚠️ DIQQAT: .env faylida BOT_TOKEN o\'rnatilmagan. Botfather tokenini kiritishingiz kerak!');
}

const bot = new TelegramBot(token, { polling: true });

console.log('🚀 AURA Interior Design Telegram boti ishga tushdi...');

try {
  bot.setMyDescription({ description: '🏆 1,420+ mamnun mijozlar va eksklyuziv interyer dizayn xizmatlari.' });
  bot.setMyShortDescription({ short_description: '👥 1,420+ foydalanuvchilar | PLATINUM Studio' });
} catch (e) {
  // ignore
}

// /id command to easily get Telegram Chat ID for Admin config
bot.onText(/\/id/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, `🆔 Sizning Telegram Chat ID manzilingiz: <code>${chatId}</code>`, { parse_mode: 'HTML' });
});

// /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Mijoz';

  const welcomeMessage = `
✨ <b>PLATINUM Interior Architecture Studio</b> botiga xush kelibsiz, <b>${firstName}</b>!

Biz har bir xonadon, kottej va tijorat ob'ektlari uchun takrorlanmas, shinam hamda eksklyuziv interyer dizaynlari yaratamiz.

👇 Pastdagi <b>"🏛 Interyer Mini Saytini Ochish"</b> tugmasini bosib:
• 🖼 <b>Qilgan ishlarimiz</b> (Portfoliomizni ko'rishingiz);
• 💰 <b>Narxlar va Kalkulyator</b> (Smetani hisoblashingiz);
• 📝 <b>Buyurtma berishingiz</b> mumkin!
  `.trim();

  await bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🏛 Interyer Mini Saytini Ochish',
            web_app: { url: webAppUrl }
          }
        ],
        [
          { text: '📞 Bosh dizayner bilan bog\'lanish', callback_data: 'contact_arch' },
          { text: '📍 Manzilimiz va Kontaktlar', callback_data: 'show_location' }
        ]
      ]
    }
  });
});

// Handling Web App Data (When order is submitted from Mini App)
bot.on('message', async (msg) => {
  if (msg.web_app_data && msg.web_app_data.data) {
    try {
      const order = JSON.parse(msg.web_app_data.data);
      const chatId = msg.chat.id;

      console.log('📦 Yangi buyurtma keldi:', order);

      // User confirmation message
      const userMsg = `
✅ <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>

📋 <b>Buyurtma tafsilotlari:</b>
👤 <b>Ism:</b> ${order.fullName}
📞 <b>Tel:</b> ${order.phone}
🏠 <b>Ob'ekt turi:</b> ${order.propertyType}
📐 <b>Maydoni:</b> ${order.area}
💎 <b>Tanlangan tarif:</b> ${order.packageType}
${order.comment ? `📝 <b>Izoh:</b> ${order.comment}` : ''}

⏰ Mutaxassisimiz tez orada siz bilan bog'lanadi!
      `.trim();

      await bot.sendMessage(chatId, userMsg, { parse_mode: 'HTML' });

      // Forward to Admin if ADMIN_CHAT_ID is set
      if (adminChatId) {
        const adminMsg = `
🔔 <b>YANGI INTERYER DESIGN BUYURTMASI!</b>

👤 <b>Mijoz:</b> ${order.fullName} (${order.tgUsername})
📞 <b>Telefon:</b> <code>${order.phone}</code>
🏠 <b>Ob'ekt:</b> ${order.propertyType} (${order.area})
💎 <b>Tarif:</b> ${order.packageType}
📝 <b>Izoh:</b> ${order.comment || 'Yo\'q'}
📅 <b>Vaqt:</b> ${order.createdAt}
        `.trim();

        await bot.sendMessage(adminChatId, adminMsg, { parse_mode: 'HTML' });
      }

    } catch (err) {
      console.error('Web App ma\'lumotini o\'qishda xatolik:', err);
    }
  }
});

// Callback Query handlers
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'contact_arch') {
    await bot.sendMessage(chatId, `📞 <b>Bosh Dizayner:</b> +998(97)300-10-50\n💬 Telegram: @platinum_interior_and_arch`, { parse_mode: 'HTML' });
  } else if (query.data === 'show_location') {
    await bot.sendMessage(chatId, `📍 <b>Bizning Offis:</b> Buxoro sh., Buxoro Savdo Majmuasi (Kritiy), Ibrohim Mo'minov ko'chasi\n⏰ <b>Ish vaqti:</b> 09:00 - 18:00 (Dush-Shanba)`, { parse_mode: 'HTML' });
  }

  await bot.answerCallbackQuery(query.id);
});
