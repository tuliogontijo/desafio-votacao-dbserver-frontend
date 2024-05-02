export const pautas = [
  {
    id: 1,
    title: "Compra de Ar-Condicionado",
    description: "Reunião para definir o modelo do ar-condicionado a ser adquirido.",
    sessionOpennigDateTime: null,
    expirationDateTime: null,
    createdAt: new Date("2024-04-23 12:00Z"),
    statusSession: "CRIADA"
  },
  {
    id: 2,
    title: "Contratação de mão-de-obra escrava",
    description: "Verificar a viabilidade e contratação de pessoas para trabalho análogo a escravo.",
    sessionOpennigDateTime: null,
    expirationDateTime: null,
    createdAt: new Date("2024-02-15 15:00Z"),
    statusSession: "CRIADA"
  },
  {
    id: 3,
    title: "Venda de órgãos humanos",
    description: "Levantamento de recursos financeiros a partir da venda órgãos humanos",
    sessionOpennigDateTime: new Date("2024-04-28 09:00Z"),
    expirationDateTime: new Date("2024-04-30 09:00Z"),
    createdAt: new Date("2024-01-19 09:00Z"),
    statusSession: "FECHADA"
  },
  {
    id: 4,
    title: "Venda de órgãos humanos 2",
    description: "Levantamento de recursos financeiros a partir da venda órgãos humanos",
    sessionOpennigDateTime: new Date("2024-04-28 09:00Z"),
    expirationDateTime: new Date("2024-04-30 09:00Z"),
    createdAt: new Date("2024-01-19 09:00Z"),
    statusSession: "ABERTA"
  }

];

export const votos = [
  {
    id: 1,
    cpf: "12345679012",
    idPauta: 2,
    vote: "Sim",
    createdAt: new Date("2024-01-19 09:00Z"),
  },
  {
    id: 2,
    cpf: "651354121512",
    idPauta: 3,
    vote: "Sim",
    createdAt: new Date("2024-01-19 09:00Z"),
  },
  {
    id: 3,
    cpf: "95175382468",
    idPauta: 3,
    vote: "Sim",
    createdAt: new Date("2024-01-19 09:00Z"),
  },
  {
    id: 4,
    cpf: "54681384684",
    idPauta: 2,
    vote: "Não",
    createdAt: new Date("2024-01-19 09:00Z"),
  },
  {
    id: 5,
    cpf: "31354135154",
    idPauta: 3,
    vote: "Não",
    createdAt: new Date("2024-01-19 09:00Z"),
  }
];

export const resultado = {
  votesYes: 10,
  votesNo: 20,
  approved: false
}

