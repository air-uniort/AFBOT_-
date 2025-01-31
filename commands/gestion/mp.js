const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'sendmp',
    aliases: [],
    run: async (client, message, args, prefix, color) => {
        // Supprimer le message de la commande
        message.delete();

        // Vérification des permissions de l'utilisateur qui envoie la commande
        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = null; // Si l'utilisateur est admin
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true; // Si l'utilisateur est propriétaire
        });

        // Vérification des permissions globales (admin, owner, etc.)
        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
            // Récupérer l'ID de l'utilisateur et le message à envoyer
            let userId = args[0]; // L'ID de l'utilisateur cible
            let messageToSend = args.slice(1).join(" "); // Le message à envoyer

            if (!userId || !messageToSend) {
                return message.reply("Tu dois spécifier un ID d'utilisateur et un message.");
            }

            // Vérifier que l'ID est valide et récupérer l'utilisateur
            try {
                let user = await client.users.fetch(userId);
                
                // Empêcher les liens Discord dans le message
                if (messageToSend.includes("discord.gg/") || messageToSend.includes("https://discord.gg/")) {
                    return message.reply("Tu ne peux pas envoyer de liens Discord dans un message privé.");
                }

                // Envoyer le message privé
                await user.send(messageToSend);
                message.reply(`Le message a été envoyé à ${user.tag}.`);
            } catch (error) {
                console.error(error);
                message.reply("Je n'ai pas pu envoyer un message à cet utilisateur. Vérifie que l'ID est correct et que l'utilisateur n'a pas désactivé les messages privés.");
            }
        } else {
            // Si l'utilisateur n'a pas les permissions nécessaires
            message.reply("Tu n'as pas la permission d'envoyer des messages privés.");
        }
    }
};
