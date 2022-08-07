
import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { embedPages } from "../notComands/functions";

let embeds = embedPages(2)


const pages = {} as { [key: string]: number }

const tempEmbed = new MessageEmbed()
  .setTitle("Desculpe")
  .setColor("RED")
  .setDescription("TEMPO DE TAREFA CANCELADO, DIGITE O COMANDO NOVAMENTE")

const getRow = (id: string, endRow?: boolean) => {

  const row = new MessageActionRow();
  row.addComponents(
    new MessageButton()
      .setCustomId("anterior_embed")
      .setStyle(endRow === true ? "DANGER" : "SECONDARY")
      .setEmoji("⬅️")
      .setDisabled(pages[id] === 0 || endRow === true)
  )
  row.addComponents(
    new MessageButton()
      .setCustomId("proximo_embed")
      .setStyle(endRow === true ? "DANGER" : "SECONDARY")
      .setEmoji("➡️")
      .setDisabled(pages[id] === embeds.length - 1 || endRow === true)
  )
  return row
}

export default {
  category: 'Sim',
  description: 'FAZ TESTE PORRAAAAA',
  slash: 'both',

  callback: async ({ user, message, interaction, channel }) => {
    embeds = embedPages(2)
    let reply: Message | undefined

    let collector

    const id = user.id
    pages[id] = pages[id] || 0

    const embed = embeds[pages[id]]


    const filter = (i: Interaction) => i.user.id === user.id



    const time = 3000

    reply = await channel.send({ embeds: [embed], components: [getRow(id)] });

    collector = reply.createMessageComponentCollector({ filter, time })

    collector.on("collect", (btnInt) => {
      if (!btnInt) return;

      btnInt.deferUpdate()

      if (btnInt.customId !== "anterior_embed" && btnInt.customId !== "proximo_embed") return;

      if (btnInt.customId === "anterior_embed" && pages[id] > 0) --pages[id];
      if (btnInt.customId === "proximo_embed" && pages[id] < embeds.length - 1) ++pages[id];


      if (reply) {
        reply.edit({
          embeds: [embeds[pages[id]]],
          components: [getRow(id)],
        })
      }
    })
    collector.on("end", (r, reason) => {
      if (reason == 'time') {
        reply?.edit({
          embeds: [tempEmbed],
          components: [getRow(id, true)]
        })

      }
    })
    return "sim";
  },

} as ICommand

