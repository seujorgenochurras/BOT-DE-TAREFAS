import { ICommand } from 'wokcommands';
import * as fs from 'fs';


const data = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))

function saveData(data: object) {
  function finished(error: any) {
    if (error) {
      console.error(error)
      return
    }

  }
  const jsonData = JSON.stringify(data, null, 2)
  fs.writeFile("./commands/tarefas.json", jsonData, finished)
  fs.writeFile("./BACKUP_tarefas.json", jsonData, finished)
  console.log("salvei data")
}

function saveTarefa(tarefa: Tarefa) {
  const newTarefaJ = {
    nome: tarefa.getName(),
    descricao1: tarefa.getDescricao1(),
    descricao2: ` \`\`\` ${tarefa.getDescricao2()} \`\`\` `,
    descricao3: tarefa.getDescricao3(),
    materia: tarefa.getMateria(),
    dataT: tarefa.getData(),
    curso: tarefa.getCurso(),
    grupo: tarefa.getGrupo(),
  }
  data[tarefa.getName()] = newTarefaJ

  saveData(data)
}


class Tarefa {
  private _name: string;
  private _data: string;
  private _curso: string;
  private _descricao1: string;
  private _descricao2: string;
  private _descricao3: string;
  private _materia: string;
  private _grupo: string | null;


  public getName(): string {
    return this._name;
  }
  public setName(value: string) {
    this._name = value;
  }

  public getData(): string {
    return this._data;
  }
  public setData(value: string) {
    this._data = value;
  }

  public getDescricao1(): string {
    return this._descricao1;
  }
  public setDescricao1(value: string) {
    this._descricao1 = value;
  }

  public getDescricao2(): string {
    return this._descricao2
  }
  public setDescricao2(value: string) {
    this._descricao2 = value
  }
  public getDescricao3(): string {
    return this._descricao3
  }
  public setDescricao3(value: string) {
    this._descricao3 = value
  }
  public getMateria(): string {
    return this._materia;
  }
  public setMateria(value: string) {
    this._materia = value;
  }

  public setCurso(value: string) {
    this._curso = value
  }

  public getCurso(): boolean {
    switch (this._curso) {
      case "true": return true;
      case "false": return false;
      default: return false;
    }
  }

  public getGrupo(): string | null {
    if (this._grupo === "UNDEFINED") {
      return null
    } else {
      return this._grupo
    }
  }

  public setGrupo(value: string) {
    value.toUpperCase()
    this._grupo = value
  }

  /**
   * Construtor de uma tarefa
   * 
   * @param nome nome da tarefa
   * @param descricao1 subTitulo
   * @param descricao2 descriçao
   * @param descricao3 descriçao fora do quadrado optinal
   * @param materia matéria da tarefa
   * @param data data de entrega
   * @param isCurso a tarefa é do curso?
   **/
  constructor(nome: string, descricao1: string, descricao2: string, descricao3 = "", materia: string, data: string, isCurso: string, grupo: string) {
    this.setName(nome)
    this.setDescricao1(descricao1)
    this.setDescricao2(descricao2)
    this.setDescricao3(descricao3)
    this.setMateria(materia)
    this.setData(data)
    this.setCurso(isCurso)
    this.setGrupo(grupo)

    saveTarefa(this) //salva no JSON
  }
}
export default {

  category: 'Test',
  description: 'Adiciona tarefa',
  slash: "both",
  ownerOnly: true,


  options: [
    {
      name: "nome", //args[0]
      description: "Titulo da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "descricao1",//args[1]
      description: "SubTitulo da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "descricao2",//args[2]
      description: "Descrição da tarefa",
      required: true,
      type: "STRING",
    },

    {
      name: "materia",//args[3]
      description: "Matéria da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "data",//args[4]
      description: "Data de entrega",
      required: true,
      type: "STRING",
    },
    {
      name: "curso",//args[5]
      description: "A tarefa é do curso?",
      required: true,
      type: "BOOLEAN",
    },
    {
      name: "grupo", //args[6]
      description: "Grupo a ser escolhido",
      required: true,
      choices: [
        { name: "GA", value: "GA" },

        { name: "GB", value: "GB", },

        { name: "undefined", value: "undefined" }
      ],
      type: "STRING"
    },
    {
      name: "descricao3",//args[7]
      description: "Descrição fora do quadrado",
      required: false,
      type: "STRING",
    },
  ],
  callback: ({ args }) => {
    console.log("executei /addTarefa")
    new Tarefa(args[0], args[1], args[2], args[7], args[3], args[4], args[5], args[6]) //NÃO MUDAR ORDEM

    return `tarefa enviada`
  },

} as ICommand