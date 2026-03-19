"use client";

import { useEffect, useMemo, useState } from "react";

type TipoRegistro = "Admissão" | "Troca";

type ItemFormulario = {
  id: string;
  nome: string;
  tamanho: string;
  quantidade: number;
};

type Registro = {
  id: string;
  data: string;
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  funcao: string;
  responsavel: string;
  solicitante: string;
  itens: ItemFormulario[];
};

const responsaveis = [
  { nome: "EVALDO DE MIRANDA BARROS", re: "14130" },
  { nome: "INES RODRIGUES DE SOUZA", re: "199631" },
  { nome: "OLGACIR MIRANDA FAGUNDES", re: "16100" },
];

const catalogo = [
  "Camisa MC",
  "Camisa ML",
  "Calça",
  "Coturno",
  "Jaqueta",
  "Colete",
  "Botina",
];

function resumir(itens: ItemFormulario[]) {
  return itens
    .map((i) => `${i.nome}(${i.tamanho})x${i.quantidade}`)
    .join(" | ");
}

function Etiqueta({
  tipo,
  nome,
  re,
  posto,
  funcao,
  responsavel,
  solicitante,
  itens,
}: any) {
  return (
    <div className="print-etiqueta hidden print:block w-[190mm]">
      <div className="border-2 border-black p-4 text-black text-sm">

        <div className="flex justify-between border-b-2 border-black pb-2">
          <div>
            <h2 className="font-bold text-lg">CONTROLE DE UNIFORME</h2>
            <p className="text-xs">{tipo}</p>
          </div>
          <p className="text-xs">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="border p-2">
            <b>Colaborador</b>
            <p className="font-bold">{nome}</p>
          </div>
          <div className="border p-2">
            <b>RE</b>
            <p className="font-bold">{re}</p>
          </div>

          <div className="border p-2">
            <b>Posto</b>
            <p>{posto}</p>
          </div>
          <div className="border p-2">
            <b>Função</b>
            <p>{funcao}</p>
          </div>

          <div className="border p-2 col-span-2">
            <b>Responsável retirada</b>
            <p>{responsavel}</p>
          </div>

          <div className="border p-2 col-span-2">
            <b>Responsável solicitou</b>
            <p>{solicitante}</p>
          </div>
        </div>

        <table className="w-full mt-3 border text-xs">
          <thead>
            <tr>
              <th className="border p-1">Peça</th>
              <th className="border p-1">Tam</th>
              <th className="border p-1">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i: any, idx: number) => (
              <tr key={idx}>
                <td className="border p-1">{i.nome}</td>
                <td className="border p-1">{i.tamanho}</td>
                <td className="border p-1 text-center">{i.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5">
          <div className="border-b h-[30px]" />
          <p className="text-xs mt-1">Assinatura</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [nome, setNome] = useState("");
  const [re, setRe] = useState("");
  const [posto, setPosto] = useState("");
  const [funcao, setFuncao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [tipo, setTipo] = useState<TipoRegistro>("Admissão");

  const [itens, setItens] = useState<ItemFormulario[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);

  function addItem(nome: string) {
    setItens((prev) => [
      ...prev,
      { id: Date.now().toString(), nome, tamanho: "", quantidade: 1 },
    ]);
  }

  function salvar() {
    setRegistros((prev) => [
      {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString(),
        tipo,
        nome,
        re,
        posto,
        funcao,
        responsavel,
        solicitante,
        itens,
      },
      ...prev,
    ]);
  }

  function imprimirEtiqueta() {
    window.print();
  }

  function imprimirControle() {
    const w = window.open("", "_blank");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial; }
            table { width:100%; border-collapse: collapse; font-size:11px }
            td,th { border:1px solid #000; padding:4px }
          </style>
        </head>
        <body>
          <h3>Controle Interno</h3>
          <table>
            <tr>
              <th>Data</th><th>Tipo</th><th>Nome</th><th>RE</th><th>Posto</th><th>Função</th><th>Peças</th>
            </tr>
            ${registros
              .map(
                (r) => `
              <tr>
                <td>${r.data}</td>
                <td>${r.tipo}</td>
                <td>${r.nome}</td>
                <td>${r.re}</td>
                <td>${r.posto}</td>
                <td>${r.funcao}</td>
                <td>${resumir(r.itens)}</td>
              </tr>`
              )
              .join("")}
          </table>
        </body>
      </html>
    `);

    w.print();
  }

  return (
    <main className="p-6 space-y-4">

      {/* FORM */}
      <div className="no-print space-y-2">
        <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
        <input placeholder="RE" onChange={(e) => setRe(e.target.value)} />
        <input placeholder="Posto" onChange={(e) => setPosto(e.target.value)} />
        <input placeholder="Função" onChange={(e) => setFuncao(e.target.value)} />
        <input placeholder="Solicitante" onChange={(e) => setSolicitante(e.target.value)} />

        <select onChange={(e) => setResponsavel(e.target.value)}>
          <option>Responsável</option>
          {responsaveis.map((r) => (
            <option key={r.re}>
              {r.nome} - {r.re}
            </option>
          ))}
        </select>

        <select onChange={(e) => setTipo(e.target.value as any)}>
          <option>Admissão</option>
          <option>Troca</option>
        </select>

        <div className="flex gap-2">
          {catalogo.map((c) => (
            <button key={c} onClick={() => addItem(c)}>
              {c}
            </button>
          ))}
        </div>

        <button onClick={salvar}>Salvar</button>
        <button onClick={imprimirEtiqueta}>Imprimir saco</button>
        <button onClick={imprimirControle}>Imprimir controle</button>
      </div>

      {/* PRINT */}
      <Etiqueta
        tipo={tipo}
        nome={nome}
        re={re}
        posto={posto}
        funcao={funcao}
        responsavel={responsavel}
        solicitante={solicitante}
        itens={itens}
      />

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print-etiqueta,
          .print-etiqueta * {
            visibility: visible;
          }

          .print-etiqueta {
            position: absolute;
            top: 0;
            left: 0;
          }

          .no-print {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}