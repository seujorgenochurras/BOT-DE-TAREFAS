import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { newLine, tarefaInterface, embedType, getObjectSize } from "../notComands/functions";
import fs from "fs"

const numberOfTarefasPerPage = 2;

function getEmbedLayout(embedType: embedType, yourEmbed: MessageEmbed, tarefa?: tarefaInterface, isCurso?: boolean): MessageEmbed {

  switch (embedType) {
    case "basic": {
      yourEmbed
        .setTitle('========== \t **Tarefas da sala** ==========')
        .setColor(0xf1dd04)
        .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
        .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
        .setTimestamp()
    }
      break;
    case "curso": {
      yourEmbed
        .setTitle('========== \t **Tarefas do *curso* ** ==========')
        .setColor(0x1DB8EE)
        .setThumbnail('https://b.thumbs.redditmedia.com/FyLIOzKOXeG4nqUxYv4gRM9JI1Vv39T4u7WSRAbnusY.jpg')
        .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
        .setTimestamp()

      break;
    }
    case "tarefas": {
      if (!tarefa) { console.log("algo deu errado (case tarefas sem tarefa) "); break; }

      //NÃO TOQUE NO ESPAÇAMENTO ABAIXO

      yourEmbed.addField(`${tarefa.nome} \t ${isCurso ? tarefa.grupo === "GA" ? "🇬 🅰️" : "🇬 🅱️" : tarefa.curso ? "🖥️" : "" /*eu quero palmas por essa*/} 
*${tarefa.materia}*
      `,
        `
        ${newLine(tarefa.descricao1)} 

  ${newLine(tarefa.descricao2)}             

  
  ${newLine(tarefa.descricao3)}
  
      ${tarefa.dataT}`, true)
      yourEmbed.setTimestamp()
      yourEmbed.addField('\u200B', '\u200B', true) //vertical
    }
  }


  return yourEmbed
}

let cursoStarterPage: number

function embedPages(paginadelete: number): MessageEmbed[] {
  let tarefasJ = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))
  const embeds: MessageEmbed[] = [];
  let a = 0; //pagina atual
  let b = 0; //pagina temporaria (se b == numero de págima por embed b = 0)
  let c = 0; //pagina temporaria de tarefa do curso
  const arrCurso: MessageEmbed[] = [];
  let embedTarefasAll = new MessageEmbed();
  let embedTarefasCurso = new MessageEmbed();

  for (let x in tarefasJ) {
    if (x === 'default') continue;
    a++;
    b++;

    embedTarefasAll = getEmbedLayout("tarefas", embedTarefasAll, tarefasJ[x])

    if (tarefasJ[x].grupo !== null) {
      embedTarefasCurso = getEmbedLayout("tarefas", embedTarefasCurso, tarefasJ[x], true)
      c++;
    }

    if (a % 2 === 0) { //alinhamento horizontal
      embedTarefasAll.addField('\u200B', '\u200B') // field horizontal
    }

    if (b === paginadelete) { //se ta no hora de criar uma nova página

      embedTarefasAll = getEmbedLayout("basic", embedTarefasAll)
      b = 0;
      embeds.push(embedTarefasAll)
      embedTarefasAll = new MessageEmbed()
    }


    if (c === paginadelete) {

      embedTarefasCurso = getEmbedLayout("curso", embedTarefasCurso)
      arrCurso.push(embedTarefasCurso)
      embedTarefasCurso = new MessageEmbed()
      c = 0;
    }
    if (getObjectSize(tarefasJ) === a) { //se está na ultima página

      if (embedTarefasAll.fields.length >= 1) {
        embedTarefasAll = getEmbedLayout("basic", embedTarefasAll)
        embeds.push(embedTarefasAll)
        cursoStarterPage = embeds.length;
      }
      if (embedTarefasCurso) {
        if (embedTarefasCurso.fields.length >= 1) {
          embedTarefasCurso = getEmbedLayout("curso", embedTarefasCurso)
          arrCurso.push(embedTarefasCurso)
        }

        arrCurso.forEach((x) => {
          embeds.push(x)
        })
      }
    }
  }
  return embeds;
}
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

  row.addComponents(
    new MessageButton()
      .setCustomId("curso_embed")
      .setStyle(endRow === true ? "DANGER" : "SECONDARY")
      .setEmoji("🖥️")
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

    const filter = (i: Interaction) => i.user.id === user.id

    const time = 60000 //em ms

    reply = await channel.send({ embeds: [embed], components: [getRow(id)] });

    collector = reply.createMessageComponentCollector({ filter, time })

    collector.on("collect", (btnInt) => {
      if (!btnInt) return;

      btnInt.deferUpdate()

      if (btnInt.customId !== "anterior_embed" && btnInt.customId !== "proximo_embed" && btnInt.customId !== "curso_embed") return;

      if (btnInt.customId === "anterior_embed" && pages[id] > 0) --pages[id];
      if (btnInt.customId === "proximo_embed" && pages[id] < embeds.length - 1) ++pages[id];
      if (btnInt.customId === "curso_embed") pages[id] = cursoStarterPage;

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
