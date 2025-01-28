const { PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require('croxydb');
const Discord = require('discord.js');

module.exports = {
    name: "log-kur",
    description: 'Otomatik log kanallarını kurarsın!',
    type: 1,
    options: [],
    run: async(client, interaction) => {
        await interaction.deferReply();

        if(interaction.user.id !== interaction.guild.ownerId) {
            return interaction.editReply('❌ | Bu komutu sadece **sunucu sahibi** kullanabilir!');
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('logkuronay_'+interaction.user.id)
                    .setLabel('Onayla')
                    .setEmoji("1039607067729727519")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('logkurred_'+interaction.user.id)
                    .setLabel('İptal')
                    .setEmoji("1040649840394260510")
                    .setStyle(ButtonStyle.Danger),
            );

        const embed = new EmbedBuilder()
            .setDescription(`Log kanallarını kurmak istediğinden emin misin?`);

        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => i.customId.startsWith('logkur') && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'logkuronay_' + interaction.user.id) {
                try {
                    const katagori1 = await interaction.guild.channels.create({
                        name: "▬▬ LOGLAR ▬▬",
                        type: ChannelType.GuildCategory
                    });

                    await katagori1.permissionOverwrites.create(katagori1.guild.roles.everyone, { ViewChannel: false });

                    const channelsToCreate = [
                        { name: "mesaj-log", dbKey: "mesaj-log" },
                        { name: "kanal-log", dbKey: "kanal-log" },
                        { name: "rol-log", dbKey: "rol-log" },
                        { name: "emoji-log", dbKey: "emoji-log" },
                        { name: "sunucu-log", dbKey: "sunucu-log" },
                        { name: "ceza-log", dbKey: "ceza-log" },
                        { name: "ses-log", dbKey: "ses-log" },
                        { name: "gelen-giden-log", dbKey: "gelen-giden-log" }
                    ];

                    for (const channelInfo of channelsToCreate) {
                        const channel = await interaction.guild.channels.create({
                            name: channelInfo.name,
                            type: ChannelType.GuildText,
                            parent: katagori1.id
                        });
                        db.set(`${channelInfo.dbKey}_${interaction.guild.id}`, channel.id);
                    }

                    await i.editReply({content: `:white_check_mark: | Log kanalları başarıyla kuruldu!`, embeds: [], components: []});
                } catch (error) {
                    console.error(error);
                    await i.editReply({content: `:x: | Log kanalları kurulurken bir hata oluştu.`, embeds: [], components: []});
                }
            } else if (i.customId === 'logkurred_' + interaction.user.id) {
                await i.editReply({content: `:white_check_mark: | Başarılı bir şekilde log kurma işlemi iptal edildi!`, embeds: [], components: []});
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({content: `❌ | Zaman aşımına uğradı, işlem iptal edildi.`, embeds: [], components: []});
            }
        });
    }
};