const { getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys');

function extractBody(message) {
    if (!message) return "";
    const type = getContentType(message);

    switch (type) {
        case "conversation":
            return message.conversation;
        case "extendedTextMessage":
            return message.extendedTextMessage.text;
        case "imageMessage":
            return message.imageMessage.caption || "";
        case "videoMessage":
            return message.videoMessage.caption || "";
        case "buttonsResponseMessage":
            return message.buttonsResponseMessage.selectedButtonId;
        case "listResponseMessage":
            return message.listResponseMessage.singleSelectReply.selectedRowId;
        case "templateButtonReplyMessage":
            return message.templateButtonReplyMessage.selectedId;
        default:
            return "";
    }
}

function extractQuoted(sock, message) {
    const type = getContentType(message);
    const contextInfo = message?.[type]?.contextInfo;

    if (!contextInfo || !contextInfo.quotedMessage) return null;

    const quotedMessage = contextInfo.quotedMessage;
    const quotedType = getContentType(quotedMessage);

    return {
        message: quotedMessage,
        type: quotedType,
        sender: jidNormalizedUser(contextInfo.participant),
        body: extractBody(quotedMessage),
        key: {
            remoteJid: contextInfo.remoteJid,
            id: contextInfo.stanzaId,
            participant: contextInfo.participant
        }
    };
}

function serialize(sock, msg) {
    if (!msg.message) return null;

    const type = getContentType(msg.message);
    const chatId = msg.key.remoteJid;
    const isGroup = chatId.endsWith('@g.us');
    const sender = isGroup
        ? jidNormalizedUser(msg.key.participant)
        : jidNormalizedUser(msg.key.remoteJid);

    const contextInfo = msg.message?.[type]?.contextInfo;
    const mentionedJid = contextInfo?.mentionedJid || [];

    const serialized = {
        raw: msg,
        key: msg.key,
        chatId,
        isGroup,
        sender,
        pushName: msg.pushName || "Unknown",
        type,
        body: extractBody(msg.message),
        mentionedJid,
        quoted: extractQuoted(sock, msg.message),
        isMedia: ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"].includes(type),
        timestamp: msg.messageTimestamp
    };

    return serialized;
}

module.exports = { serialize };