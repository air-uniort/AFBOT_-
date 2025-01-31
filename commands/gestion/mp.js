const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'sendmp',
    aliases: [],
    run: async (client, message, args) => {
        // Supprimer le message de la commande pour garder le chat propre
        message.delete();

        // Vérification si l'utilisateur a la permission de lancer la commande
        let perm = false;
        message.member.roles.cache.forEach(role => {
            // Vérifie les rôles d'admin ou de propriétaire définis dans la base de données
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
        });

        // Si l'utilisateur est un admin ou un propriétaire global, on continue
        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

            // Récupère les arguments de la commande (ID utilisateur et message à envoyer)
            let userId = args[0];
            let messageToSend = args.slice(1).join(" "); // Le reste des arguments sera le message

            // Si l'utilisateur n'a pas spécifié un ID ou un message, on renvoie une erreur
            if (!userId || !messageToSend) {
                return message.reply("Tu dois spécifier un ID d'utilisateur et un message.");
            }

            try {
                // Essaie de récupérer l'utilisateur par son ID
                let user = await client.users.fetch(userId);

                // Empêcher l'envoi de liens discord.gg dans les messages privés
                if (messageToSend.includes("discord.gg/") || messageToSend.includes("https://discord.gg/")) {
                    return message.reply("Tu ne peux pas envoyer de liens Discord dans un message privé.");
                }

                // Envoie le message privé à l'utilisateur
                await user.send(messageToSend);
                message.reply(`Le message a été envoyé à ${user.tag}.`);

            } catch (error) {
                // Si l'utilisateur n'a pas été trouvé ou si une erreur se produit, on renvoie un message d'erreur
                console.error(error);
                message.reply("Je n'ai pas pu envoyer un message à cet utilisateur. Vérifie l'ID ou si l'utilisateur a bloqué les messages privés.");
            }
        } else {
            // Si l'utilisateur n'a pas les bonnes permissions
            message.reply("Tu n'as pas la permission d'envoyer des messages privés.");
        }
    }
};

