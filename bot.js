
                let Discord;
                let Database;
                if(typeof window !== "undefined"){
                    Discord = DiscordJS;
                    Database = EasyDatabase;
                } else {
                    Discord = require("discord.js");
                    Database = require("easy-json-database");
                }
                const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
                const s4d = {
                    Discord,
                    client: null,
                    tokenInvalid: false,
                    reply: null,
                    joiningMember: null,
                    database: new Database("./db.json"),
                    checkMessageExists() {
                        if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
                        if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
                    }
                };
                s4d.client = new s4d.Discord.Client({
                    fetchAllMembers: true
                });
                s4d.client.on('raw', async (packet) => {
                    if(['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)){
                        const guild = s4d.client.guilds.cache.get(packet.d.guild_id);
                        if(!guild) return;
                        const member = guild.members.cache.get(packet.d.user_id) || guild.members.fetch(d.user_id).catch(() => {});
                        if(!member) return;
                        const channel = s4d.client.channels.cache.get(packet.d.channel_id);
                        if(!channel) return;
                        const message = channel.messages.cache.get(packet.d.message_id) || await channel.messages.fetch(packet.d.message_id).catch(() => {});
                        if(!message) return;
                        s4d.client.emit(packet.t, guild, channel, message, member, packet.d.emoji.name);
                    }
                });
                var arguments2, command;


s4d.client.login(process.env.token).catch((e) => { s4d.tokenInvalid = true; s4d.tokenError = e; });

s4d.client.on('message', async (message) => {
  if (message.author.bot) {return}
    const filtrer = {"bad":"","fuck":"","crap":""}
    for (var v in filtrer) {
        if (message.content.toLowerCase().includes(v))
            if (message.deletable) {
                message.delete()
                message.author.send("Your message has been deleted because it contained a bad word.")
            }
    }
    const modrole = message.guild.roles.cache.find(role => role.name === "head mod");
    const mod = message.member.roles.cache.has(modrole.id)
    const owner = message.guild.ownerId===message.author.id
    const comd = "!help !ping"
    const modcmd = "!unlock !lock !kick !mute !unmute"
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(' ');
        const fi = args[0]
        const cmd = args.shift();
        if (fi==="help") {
            message.reply("Commands: ")
            var cmds = comd.split(" ")
            for (var v in cmds) {
                message.channel.send(cmds[v])
            }
            if (mod) {
                cmds = modcmd.split(" ")
                for (var v in cmds) {
                    message.channel.send(cmds[v])
                }
            } else {
                if (owner) {
                    cmds = modcmd.split(" ")
                    for (var v in cmds) {
                        message.channel.send(cmds[v])
                    }
                }
            }
        }
        if (fi==="ping") {
            const msg = await message.reply('Pinging...');
            await msg.edit(`Pong! The round trip took ${Date.now() - msg.createdTimestamp}ms.`);
        }
        if (mod) {
            if (fi==="unlock") {
                message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
                message.reply("Channel unlocked.")
            }
            if (fi==="lock") {
                message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                message.reply("Channel locked.")
            }
            if (fi==="kick") {
                const member = message.mentions.members.first();
                if (!member) {
                    message.reply("Please mention a valid member of this server");
                }
                if (member) {
                    member.kick();
                    message.reply(`${member.user.tag} was kicked from the server.`);
                }
            }
            if (fi==="mute") {
                const member = message.mentions.members.first();
                if (!member) {
                    message.reply("Please mention a valid member of this server");
                }
                if (member) {
                    member.timeout(60*60*24*30)
                    message.reply(`<@${member.user.id}> was muted.`);
                }
            }
        }
    }
});


                s4d;
            
