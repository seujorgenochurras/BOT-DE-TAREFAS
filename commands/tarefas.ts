
import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { cursoStarterPage, embedPages } from "../notComands/functions";


const numberOfTarefasPerPage = 2;
let embeds = embedPages(numberOfTarefasPerPage)


const pages = {} as { [key: string]: number }

const tempEmbed = new MessageEmbed()
  .setTitle("Desculpe")
  .setColor("RED")
  .setDescription("TEMPO DE TAREFA CANCELADO, DIGITE O COMANDO NOVAMENTE")

const getRow = (id: string, endRow?: boolean) => {

  const row = new MessageActionRow();
  row.addComponents(
    new MessageButton()
      .setCustomId("primeiro_embed")
      .setStyle("SECONDARY")
      .setEmoji("⏮️")
      .setDisabled(pages[id] === 0 || endRow === true)
  ),
    row.addComponents(
      new MessageButton()
        .setCustomId("anterior_embed")
        .setStyle(endRow === true ? "DANGER" : "SECONDARY")
        .setEmoji("⬅️")
        .setDisabled(pages[id] === 0 || endRow === true)
    ),
    row.addComponents(
      new MessageButton()
        .setCustomId("cursos")
        .setStyle("SECONDARY")
        .setEmoji("🖥️")
        .setDisabled(endRow === true)
    ),
    row.addComponents(
      new MessageButton()
        .setCustomId("proximo_embed")
        .setStyle(endRow === true ? "DANGER" : "SECONDARY")
        .setEmoji("➡️")
        .setDisabled(pages[id] === embeds.length - 1 || endRow === true)
    )
  row.addComponents(
    new MessageButton()
      .setCustomId("ultimo")
      .setStyle("SECONDARY")
      .setEmoji("⏭️")
       .setDisabled(pages[id] === embeds.length - 1 || endRow === true)
  )



  return row
}

export default {
  category: 'Sim',
  description: 'FAZ TESTE PORRAAAAA',
  slash: 'both',

  callback: async ({ user, channel }) => {
    embeds = embedPages(numberOfTarefasPerPage)
    let reply: Message | undefined
    let collector
    const id = user.id
    pages[id] = pages[id] || 0

    const embed = embeds[pages[id]]
    const filter = (i: Interaction) => {
      return i.user.id === user.id

    }
    const time = 30000 //em ms

    reply = await channel.send({ embeds: [embed], components: [getRow(id)] });

    collector = reply.createMessageComponentCollector({ filter, time })
    collector.on("collect", (btnInt) => {
      if (!btnInt) return;

      btnInt.deferUpdate()

      //if (btnInt.customId !== "anterior_embed" && btnInt.customId !== "proximo_embed") return;
      if (btnInt.customId === "anterior_embed" && pages[id] > 0) --pages[id];
      else if (btnInt.customId === "proximo_embed" && pages[id] < embeds.length - 1) ++pages[id];
      else if (btnInt.customId === "primeiro_embed") {
        pages[id] = 0
      }
      else if (btnInt.customId === "cursos") {
        pages[id] = cursoStarterPage
      }
      else if (btnInt.customId === "ultimo") {
        pages[id] = embeds.length - 1
      } else {
        console.log("erro, customID do embed não encontrado")
      }

      if (reply) {
        reply.edit({
          embeds: [embeds[pages[id]]],
          components: [getRow(id)],
        })
      }
    })
    collector.on("end", (_r, reason) => {
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

