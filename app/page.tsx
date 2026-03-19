"use client";

import { useEffect, useMemo, useState } from "react";

type TipoRegistro = "Admissão" | "Troca";

type ItemCatalogo = {
  id: string;
  nome: string;
  tamanhoPadrao?: string;
};

type ItemFormulario = {
  id: string;
  nome: string;
  tamanho: string;
  quantidade: number;
};

type RegistroInterno = {
  id: string;
  data: string;
  tipo: TipoRegistro;
  colaborador: string;
  re: string;
  posto: string;
  cargo: string;
  responsavel: string;
  solicitante?: string;
  observacao?: string;
  itens: ItemFormulario[];
};

const responsaveis = [
  { nome: "EVALDO DE MIRANDA BARROS", re: "14130" },
  { nome: "INES RODRIGUES DE SOUZA", re: "199631" },
  { nome: "OLGACIR MIRANDA FAGUNDES", re: "16100" },
];

const catalogo: ItemCatalogo[] = [
  { id: "camisa_mc", nome: "Camisa MC" },
  { id: "camisa_ml", nome: "Camisa ML" },
  { id: "calca", nome: "Calça" },
  { id: "coturno", nome: "Coturno" },
  { id: "jaqueta", nome: "Jaqueta" },
  { id: "capa_colete", nome: "Capa de Colete", tamanhoPadrao: "Único" },
  { id: "colete_laranja", nome: "Colete Refletivo Laranja", tamanhoPadrao: "Único" },
  { id: "balieiro", nome: "Balieiro", tamanhoPadrao: "Único" },
  { id: "cinturao", nome: "Cinturão", tamanhoPadrao: "Único" },
  { id: "porta_tonfa", nome: "Porta-Tonfa", tamanhoPadrao: "Único" },
  { id: "bone", nome: "Boné", tamanhoPadrao: "Único" },
  { id: "fiel", nome: "Fiel", tamanhoPadrao: "Único" },
  { id: "apito", nome: "Apito", tamanhoPadrao: "Único" },
  { id: "botina", nome: "Botina" },
  { id: "bota_elastico", nome: "Bota de Elástico" },
  { id: "bota_bombeiro", nome: "Bota de Bombeiro" },
  { id: "avental_raspa", nome: "Avental de Raspa", tamanhoPadrao: "Único" },
  { id: "perneira", nome: "Perneira", tamanhoPadrao: "Único" },
  { id: "capacete_azul", nome: "Capacete Azul Completo", tamanhoPadrao: "Único" },
  { id: "capacete_cinza", nome: "Capacete Cinza Completo", tamanhoPadrao: "Único" },
  { id: "oculos", nome: "Óculos de Segurança", tamanhoPadrao: "Único" },
  { id: "luva_vaqueta", nome: "Luva de Vaqueta" },
  { id: "luva_multitato", nome: "Luva Multitato" },
  { id: "protetor_concha", nome: "Protetor Auricular (Concha)", tamanhoPadrao: "Único" },
  { id: "protetor_facial", nome: "Protetor Facial", tamanhoPadrao: "Único" },
];

const kitsPorCargo: Record<string, { id: string; quantidade: number }[]> = {
  vigilante: [
    { id: "camisa_mc", quantidade: 2 },
    { id: "calca", quantidade: 2 },
    { id: "coturno", quantidade: 1 },
    { id: "jaqueta", quantidade: 1 },
    { id: "capa_colete", quantidade: 1 },
    { id: "colete_laranja", quantidade: 1 },
    { id: "balieiro", quantidade: 1 },
    { id: "cinturao", quantidade: 1 },
    { id: "porta_tonfa", quantidade: 1 },
    { id: "bone", quantidade: 1 },
    { id: "fiel", quantidade: 1 },
    { id: "apito", quantidade: 1 },
  ],
  jardineiro: [
    { id: "camisa_ml", quantidade: 2 },
    { id: "calca", quantidade: 2 },
    { id: "botina", quantidade: 1 },
    { id: "avental_raspa", quantidade: 1 },
    { id: "perneira", quantidade: 1 },
    { id: "capacete_azul", quantidade: 1 },
    { id: "luva_vaqueta", quantidade: 1 },
    { id: "luva_multitato", quantidade: 1 },
    { id: "colete_laranja", quantidade: 1 },
    { id: "oculos", quantidade: 1 },
    { id: "protetor_concha", quantidade: 1 },
    { id: "protetor_facial", quantidade: 1 },
  ],
  auxiliar_limpeza: [
    { id: "camisa_mc", quantidade: 2 },
    { id: "calca", quantidade: 2 },
    { id: "botina", quantidade: 1 },
    { id: "bota_elastico", quantidade: 1 },
    { id: "colete_laranja", quantidade: 1 },
    { id: "oculos", quantidade: 1 },
    { id: "capacete_cinza", quantidade: 1 },
  ],
  auxiliar_servicos_gerais: [
    { id: "camisa_mc", quantidade: 2 },
    { id: "calca", quantidade: 2 },
    { id: "botina", quantidade: 1 },
    { id: "bota_elastico", quantidade: 1 },
    { id: "colete_laranja", quantidade: 1 },
    { id: "oculos", quantidade: 1 },
    { id: "capacete_cinza", quantidade: 1 },
  ],
  vigia_florestal: [
    { id: "camisa_ml", quantidade: 2 },
    { id: "calca", quantidade: 2 },
    { id: "jaqueta", quantidade: 1 },
    { id: "bota_bombeiro", quantidade: 1 },
    { id: "colete_laranja", quantidade: 1 },
    { id: "bone", quantidade: 1 },
    { id: "cinturao", quantidade: 1 },
  ],
};

function montarItensDoCargo(cargo: string): ItemFormulario[] {
  const kit = kitsPorCargo[cargo] || [];

  return kit.map((item) => {
    const peca = catalogo.find((p) => p.id === item.id);

    return {
      id: peca?.id || item.id,
      nome: peca?.nome || item.id,
      tamanho: peca?.tamanhoPadrao || "",
      quantidade: item.quantidade,
    };
  });
}

function resumirItensInterno(itens: ItemFormulario[]) {
  return itens
    .map((item) => {
      const tamanho = item.tamanho ? ` (${item.tamanho})` : "";
      return `• ${item.nome}${tamanho} - ${item.quantidade} un.`;
    })
    .join("\n");
}

function campoInputClass() {
  return "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400";
}

function campoLabelClass() {
  return "text-sm font-medium text-slate-700";
}

function botaoPrimarioClass() {
  return "rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800";
}

function botaoSucessoClass() {
  return "rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700";
}

function cardClass() {
  return "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
}

function badgeTipo(tipo: TipoRegistro) {
  return tipo === "Admissão"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-amber-50 text-amber-700 border border-amber-200";
}

function TabelaItens({
  itens,
  onAlterarTamanho,
  onAlterarQuantidade,
  onRemover,
  mostrarAcoes = true,
}: {
  itens: ItemFormulario[];
  onAlterarTamanho?: (index: number, valor: string) => void;
  onAlterarQuantidade?: (index: number, valor: number) => void;
  onRemover?: (index: number) => void;
  mostrarAcoes?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700">
              Peça
            </th>
            <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700">
              Tamanho
            </th>
            <th className="border-b border-slate-200 p-3 text-center font-semibold text-slate-700">
              Qtd
            </th>
            {mostrarAcoes && (
              <th className="border-b border-slate-200 p-3 text-center font-semibold text-slate-700">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={`${item.id}-${index}`} className="hover:bg-slate-50/70">
              <td className="border-b border-slate-100 p-3 text-slate-800">
                {item.nome}
              </td>
              <td className="border-b border-slate-100 p-3">
                {mostrarAcoes ? (
                  <input
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                    value={item.tamanho}
                    onChange={(e) => onAlterarTamanho?.(index, e.target.value)}
                    placeholder="Ex: M, 42, 39, Único"
                  />
                ) : (
                  <span className="text-slate-700">{item.tamanho || "-"}</span>
                )}
              </td>
              <td className="border-b border-slate-100 p-3 text-center">
                {mostrarAcoes ? (
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm outline-none focus:border-slate-400"
                    value={item.quantidade}
                    onChange={(e) =>
                      onAlterarQuantidade?.(index, Number(e.target.value))
                    }
                  />
                ) : (
                  <span className="text-slate-700">{item.quantidade}</span>
                )}
              </td>
              {mostrarAcoes && (
                <td className="border-b border-slate-100 p-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemover?.(index)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Remover
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResumoLateral({
  tipo,
  nome,
  re,
  posto,
  responsavel,
  cargo,
  totalItens,
  solicitante,
}: {
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  responsavel: string;
  cargo: string;
  totalItens: number;
  solicitante?: string;
}) {
  return (
    <div className={`${cardClass()} space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Resumo</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeTipo(tipo)}`}>
          {tipo}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Colaborador</p>
          <p className="font-semibold text-slate-900">{nome || "-"}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">RE</p>
            <p className="font-semibold text-slate-900">{re || "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Total de peças</p>
            <p className="font-semibold text-slate-900">{totalItens}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Posto</p>
          <p className="font-semibold text-slate-900">{posto || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">{tipo === "Admissão" ? "Cargo" : "Descrição"}</p>
          <p className="font-semibold text-slate-900">{cargo || "-"}</p>
        </div>

        {solicitante ? (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Solicitante</p>
            <p className="font-semibold text-slate-900">{solicitante}</p>
          </div>
        ) : null}

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Responsável</p>
          <p className="font-semibold text-slate-900">{responsavel || "-"}</p>
        </div>
      </div>
    </div>
  );
}

function EtiquetaSaco({
  tipo,
  nome,
  re,
  posto,
  responsavel,
  cargoLabel,
  itens,
  solicitante,
  observacao,
}: {
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  responsavel: string;
  cargoLabel: string;
  itens: ItemFormulario[];
  solicitante?: string;
  observacao?: string;
}) {
  return (
    <section className="print-etiqueta mx-auto max-w-[820px] rounded-xl border-2 border-black bg-white p-4">
      <div className="border-b-2 border-black pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-wide">UNIFORMES</h2>
            <p className="text-[11px] uppercase tracking-wide">
              Identificação do saco / via do responsável
            </p>
          </div>
          <div className="text-right text-[11px]">
            <p className="font-semibold">{tipo}</p>
            <p>{new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border-2 border-black px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">Colaborador</p>
          <p className="text-base font-bold leading-tight">
            {nome || "________________"}
          </p>
        </div>

        <div className="rounded-md border-2 border-black px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">RE</p>
          <p className="text-base font-bold leading-tight">
            {re || "________________"}
          </p>
        </div>

        <div className="rounded-md border px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">Posto</p>
          <p className="text-sm font-semibold leading-tight">
            {posto || "________________"}
          </p>
        </div>

        <div className="rounded-md border px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">Cargo</p>
          <p className="text-sm font-semibold leading-tight">{cargoLabel}</p>
        </div>

        {solicitante ? (
          <div className="rounded-md border px-3 py-2 md:col-span-2">
            <p className="text-[10px] uppercase tracking-wide text-gray-600">
              Solicitante
            </p>
            <p className="text-sm font-semibold leading-tight">{solicitante}</p>
          </div>
        ) : null}

        <div className="rounded-md border px-3 py-2 md:col-span-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">
            Responsável pela retirada
          </p>
          <p className="text-sm font-semibold leading-tight">
            {responsavel || "________________"}
          </p>
        </div>

        {observacao ? (
          <div className="rounded-md border px-3 py-2 md:col-span-2">
            <p className="text-[10px] uppercase tracking-wide text-gray-600">
              Observação
            </p>
            <p className="text-sm leading-tight">{observacao}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide">
          Itens entregues
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1.5 text-left">Peça</th>
                <th className="border p-1.5 text-left">Tamanho</th>
                <th className="border p-1.5 text-center">Qtd</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td className="border p-1.5 leading-tight">{item.nome}</td>
                  <td className="border p-1.5 leading-tight">
                    {item.tamanho || "-"}
                  </td>
                  <td className="border p-1.5 text-center leading-tight">
                    {item.quantidade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tipo === "Troca" ? (
        <div className="mt-3 rounded-md border border-black p-2 text-[11px]">
          Em caso de troca, as peças antigas devem ser devolvidas em até 30 dias,
          conforme controle interno do setor.
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <div className="mb-1 h-[32px] border-b border-black" />
          <p className="text-[11px]">Assinatura de quem entregou</p>
        </div>
        <div>
          <div className="mb-1 h-[32px] border-b border-black" />
          <p className="text-[11px]">Assinatura de quem retirou</p>
        </div>
      </div>
    </section>
  );
}

function TabelaControleInterno({
  registros,
}: {
  registros: RegistroInterno[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full border-collapse text-[11px] md:text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="w-[8%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Data</th>
            <th className="w-[8%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Tipo</th>
            <th className="w-[12%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Colaborador</th>
            <th className="w-[6%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">RE</th>
            <th className="w-[10%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Posto</th>
            <th className="w-[31%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Peças</th>
            <th className="w-[13%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Responsável</th>
            <th className="w-[12%] border-b border-slate-200 p-2 text-left font-semibold text-slate-700">Assinatura</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-center text-slate-500">
                Nenhum registro salvo ainda.
              </td>
            </tr>
          ) : (
            registros.map((registro) => (
              <tr key={registro.id} className="break-inside-avoid hover:bg-slate-50">
                <td className="border-b border-slate-100 p-2 align-top">{registro.data}</td>
                <td className="border-b border-slate-100 p-2 align-top">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${badgeTipo(registro.tipo)}`}>
                    {registro.tipo}
                  </span>
                </td>
                <td className="border-b border-slate-100 p-2 align-top font-medium text-slate-900">
                  {registro.colaborador}
                </td>
                <td className="border-b border-slate-100 p-2 align-top">{registro.re}</td>
                <td className="border-b border-slate-100 p-2 align-top">{registro.posto}</td>
                <td className="border-b border-slate-100 p-2 align-top whitespace-pre-line leading-4">
                  {resumirItensInterno(registro.itens)}
                </td>
                <td className="border-b border-slate-100 p-2 align-top">{registro.responsavel}</td>
                <td className="border-b border-slate-100 p-2 align-top">
                  <div className="mt-5 w-full border-b border-black" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Admissao({
  onSalvarRegistro,
}: {
  onSalvarRegistro: (registro: RegistroInterno) => void;
}) {
  const [nome, setNome] = useState("");
  const [re, setRe] = useState("");
  const [posto, setPosto] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [cargo, setCargo] = useState("vigilante");
  const [itemExtraId, setItemExtraId] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([]);
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "etiqueta">("nenhum");

  useEffect(() => {
    setItens(montarItensDoCargo(cargo));
  }, [cargo]);

  const totalItens = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.quantidade, 0);
  }, [itens]);

  const cargoLabel = useMemo(() => {
    const labels: Record<string, string> = {
      vigilante: "Vigilante",
      jardineiro: "Jardineiro",
      auxiliar_limpeza: "Auxiliar de Limpeza",
      auxiliar_servicos_gerais: "Auxiliar de Serviços Gerais",
      vigia_florestal: "Vigia Florestal",
    };
    return labels[cargo] || cargo;
  }, [cargo]);

  function atualizarTamanho(index: number, valor: string) {
    setItens((atual) =>
      atual.map((item, i) => (i === index ? { ...item, tamanho: valor } : item))
    );
  }

  function atualizarQuantidade(index: number, valor: number) {
    const quantidade = Number.isNaN(valor) || valor < 1 ? 1 : valor;
    setItens((atual) =>
      atual.map((item, i) => (i === index ? { ...item, quantidade } : item))
    );
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  function adicionarItemExtra() {
    const peca = catalogo.find((item) => item.id === itemExtraId);
    if (!peca) return;

    setItens((atual) => [
      ...atual,
      {
        id: peca.id,
        nome: peca.nome,
        tamanho: peca.tamanhoPadrao || "",
        quantidade: 1,
      },
    ]);

    setItemExtraId("");
  }

  function montarRegistro(): RegistroInterno {
    return {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      data: new Date().toLocaleDateString("pt-BR"),
      tipo: "Admissão",
      colaborador: nome,
      re,
      posto,
      cargo: cargoLabel,
      responsavel,
      itens,
    };
  }

  function salvarEntrega() {
    const registro = montarRegistro();
    onSalvarRegistro(registro);
    alert("Entrega salva no controle interno.");
  }

  function imprimirEtiqueta() {
    setModoImpressao("etiqueta");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 100);
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-etiqueta {
            display: none !important;
          }

          .somente-etiqueta .print-etiqueta {
            display: block !important;
          }

          .print-etiqueta {
            max-width: 820px !important;
            padding: 16px !important;
            border-width: 1.5px !important;
          }

          .print-etiqueta table {
            font-size: 12px !important;
          }

          .print-etiqueta th,
          .print-etiqueta td {
            padding: 4px !important;
          }
        }
      `}</style>

      <div className={modoImpressao === "etiqueta" ? "somente-etiqueta" : ""}>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className={cardClass()}>
            <h2 className="mb-5 text-xl font-semibold text-slate-900">Admissão</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className={campoLabelClass()}>Nome do colaborador</label>
                <input
                  className={campoInputClass()}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>RE</label>
                <input
                  className={campoInputClass()}
                  value={re}
                  onChange={(e) => setRe(e.target.value)}
                  placeholder="Digite o RE"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>Posto do colaborador</label>
                <input
                  className={campoInputClass()}
                  value={posto}
                  onChange={(e) => setPosto(e.target.value)}
                  placeholder="Digite o posto"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>Responsável pela retirada</label>
                <select
                  className={campoInputClass()}
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {responsaveis.map((item) => (
                    <option key={item.re} value={`${item.nome} - RE ${item.re}`}>
                      {item.nome} - RE {item.re}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className={campoLabelClass()}>Cargo</label>
                <select
                  className={campoInputClass()}
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  <option value="vigilante">Vigilante</option>
                  <option value="jardineiro">Jardineiro</option>
                  <option value="auxiliar_limpeza">Auxiliar de Limpeza</option>
                  <option value="auxiliar_servicos_gerais">
                    Auxiliar de Serviços Gerais
                  </option>
                  <option value="vigia_florestal">Vigia Florestal</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <TabelaItens
                itens={itens}
                onAlterarTamanho={atualizarTamanho}
                onAlterarQuantidade={atualizarQuantidade}
                onRemover={removerItem}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 font-medium text-slate-900">Adicionar item extra</h3>

                <div className="flex flex-col gap-3 md:flex-row">
                  <select
                    className={campoInputClass()}
                    value={itemExtraId}
                    onChange={(e) => setItemExtraId(e.target.value)}
                  >
                    <option value="">Selecione uma peça</option>
                    {catalogo.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={adicionarItemExtra}
                    className={botaoPrimarioClass()}
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                <button onClick={salvarEntrega} className={botaoSucessoClass()}>
                  Salvar no controle interno
                </button>

                <button onClick={imprimirEtiqueta} className={botaoPrimarioClass()}>
                  Imprimir etiqueta do saco
                </button>
              </div>
            </div>
          </div>

          <ResumoLateral
            tipo="Admissão"
            nome={nome}
            re={re}
            posto={posto}
            responsavel={responsavel}
            cargo={cargoLabel}
            totalItens={totalItens}
          />
        </div>

        <EtiquetaSaco
          tipo="Admissão"
          nome={nome}
          re={re}
          posto={posto}
          responsavel={responsavel}
          cargoLabel={cargoLabel}
          itens={itens}
        />
      </div>
    </>
  );
}

function Troca({
  onSalvarRegistro,
}: {
  onSalvarRegistro: (registro: RegistroInterno) => void;
}) {
  const [nome, setNome] = useState("");
  const [re, setRe] = useState("");
  const [posto, setPosto] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [itemId, setItemId] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([]);
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "etiqueta">("nenhum");

  const totalItens = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.quantidade, 0);
  }, [itens]);

  function adicionarPecaTroca() {
    const peca = catalogo.find((item) => item.id === itemId);
    if (!peca) return;

    setItens((atual) => [
      ...atual,
      {
        id: peca.id,
        nome: peca.nome,
        tamanho: peca.tamanhoPadrao || "",
        quantidade: 1,
      },
    ]);

    setItemId("");
  }

  function atualizarTamanho(index: number, valor: string) {
    setItens((atual) =>
      atual.map((item, i) => (i === index ? { ...item, tamanho: valor } : item))
    );
  }

  function atualizarQuantidade(index: number, valor: number) {
    const quantidade = Number.isNaN(valor) || valor < 1 ? 1 : valor;
    setItens((atual) =>
      atual.map((item, i) => (i === index ? { ...item, quantidade } : item))
    );
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  function montarRegistro(): RegistroInterno {
    return {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      data: new Date().toLocaleDateString("pt-BR"),
      tipo: "Troca",
      colaborador: nome,
      re,
      posto,
      cargo: "Troca de uniforme",
      responsavel,
      solicitante,
      observacao:
        "As peças antigas devem ser devolvidas em até 30 dias, conforme controle interno do setor.",
      itens,
    };
  }

  function salvarTroca() {
    const registro = montarRegistro();
    onSalvarRegistro(registro);
    alert("Troca salva no controle interno.");
  }

  function imprimirEtiqueta() {
    setModoImpressao("etiqueta");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 100);
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-etiqueta {
            display: none !important;
          }

          .somente-etiqueta .print-etiqueta {
            display: block !important;
          }

          .print-etiqueta {
            max-width: 820px !important;
            padding: 16px !important;
            border-width: 1.5px !important;
          }

          .print-etiqueta table {
            font-size: 12px !important;
          }

          .print-etiqueta th,
          .print-etiqueta td {
            padding: 4px !important;
          }
        }
      `}</style>

      <div className={modoImpressao === "etiqueta" ? "somente-etiqueta" : ""}>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className={cardClass()}>
            <h2 className="mb-5 text-xl font-semibold text-slate-900">Troca</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className={campoLabelClass()}>Nome do colaborador</label>
                <input
                  className={campoInputClass()}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>RE</label>
                <input
                  className={campoInputClass()}
                  value={re}
                  onChange={(e) => setRe(e.target.value)}
                  placeholder="Digite o RE"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>Posto do colaborador</label>
                <input
                  className={campoInputClass()}
                  value={posto}
                  onChange={(e) => setPosto(e.target.value)}
                  placeholder="Digite o posto"
                />
              </div>

              <div className="space-y-1">
                <label className={campoLabelClass()}>Solicitante</label>
                <input
                  className={campoInputClass()}
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  placeholder="Quem solicitou a troca"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className={campoLabelClass()}>Responsável pela retirada</label>
                <select
                  className={campoInputClass()}
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {responsaveis.map((item) => (
                    <option key={item.re} value={`${item.nome} - RE ${item.re}`}>
                      {item.nome} - RE {item.re}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 font-medium text-slate-900">Adicionar peça da troca</h3>

                <div className="flex flex-col gap-3 md:flex-row">
                  <select
                    className={campoInputClass()}
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                  >
                    <option value="">Selecione uma peça</option>
                    {catalogo.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={adicionarPecaTroca}
                    className={botaoPrimarioClass()}
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <TabelaItens
                itens={itens}
                onAlterarTamanho={atualizarTamanho}
                onAlterarQuantidade={atualizarQuantidade}
                onRemover={removerItem}
              />

              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Observação de troca</p>
                <p className="mt-1">
                  As peças antigas devem ser devolvidas em até 30 dias, conforme
                  controle interno do setor.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                <button onClick={salvarTroca} className={botaoSucessoClass()}>
                  Salvar no controle interno
                </button>

                <button onClick={imprimirEtiqueta} className={botaoPrimarioClass()}>
                  Imprimir etiqueta da troca
                </button>
              </div>
            </div>
          </div>

          <ResumoLateral
            tipo="Troca"
            nome={nome}
            re={re}
            posto={posto}
            responsavel={responsavel}
            cargo="Troca de uniforme"
            totalItens={totalItens}
            solicitante={solicitante}
          />
        </div>

        <EtiquetaSaco
          tipo="Troca"
          nome={nome}
          re={re}
          posto={posto}
          responsavel={responsavel}
          cargoLabel="Troca de uniforme"
          itens={itens}
          solicitante={solicitante}
          observacao="As peças antigas devem ser devolvidas em até 30 dias, conforme controle interno do setor."
        />
      </div>
    </>
  );
}

function ControleInterno({
  registros,
  onRemoverRegistro,
}: {
  registros: RegistroInterno[];
  onRemoverRegistro: (id: string) => void;
}) {
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "interno">("nenhum");

  function imprimirControleInterno() {
    setModoImpressao("interno");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 100);
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-controle {
            display: none !important;
          }

          .somente-controle .print-controle {
            display: block !important;
          }

          .print-controle {
            max-width: 100% !important;
            padding: 12px !important;
            border-width: 1px !important;
          }

          .print-controle table {
            font-size: 11px !important;
          }

          .print-controle th,
          .print-controle td {
            padding: 4px !important;
          }

          .print-controle tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className={modoImpressao === "interno" ? "somente-controle" : ""}>
        <div className={cardClass()}>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Controle Interno</h2>
              <p className="text-sm text-slate-500">
                Histórico consolidado de admissões e trocas
              </p>
            </div>

            <button
              onClick={imprimirControleInterno}
              className={botaoPrimarioClass()}
            >
              Imprimir folha interna
            </button>
          </div>

          <TabelaControleInterno registros={registros} />

          {registros.length > 0 && (
            <div className="mt-5 space-y-2">
              <h3 className="font-medium text-slate-900">Remover registro salvo</h3>
              <div className="flex flex-wrap gap-2">
                {registros.map((registro) => (
                  <button
                    key={registro.id}
                    type="button"
                    onClick={() => onRemoverRegistro(registro.id)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Remover {registro.colaborador || "sem nome"} - {registro.data}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="print-controle mx-auto max-w-7xl rounded-xl border-2 border-black bg-white p-5">
          <div className="mb-4 border-b border-black pb-3">
            <h2 className="text-xl font-bold">Controle Interno de Uniformes</h2>
            <p className="text-sm">
              Data da impressão: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>

          <TabelaControleInterno registros={registros} />
        </section>
      </div>
    </>
  );
}

export default function Home() {
  const [aba, setAba] = useState<"admissao" | "troca" | "controle">("admissao");
  const [registros, setRegistros] = useState<RegistroInterno[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("controle-interno-uniformes");
    if (salvo) {
      setRegistros(JSON.parse(salvo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("controle-interno-uniformes", JSON.stringify(registros));
  }, [registros]);

  function salvarRegistro(registro: RegistroInterno) {
    setRegistros((atual) => [registro, ...atual]);
    setAba("controle");
  }

  function removerRegistro(id: string) {
    setRegistros((atual) => atual.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="no-print">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Controle de Uniformes
            </h1>
            <p className="text-sm text-slate-500">
              Gestão de admissões, trocas, etiquetas e controle interno
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                aba === "admissao"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setAba("admissao")}
            >
              Admissão
            </button>

            <button
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                aba === "troca"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setAba("troca")}
            >
              Troca
            </button>

            <button
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                aba === "controle"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setAba("controle")}
            >
              Controle interno
            </button>
          </div>
        </div>

        {aba === "admissao" && <Admissao onSalvarRegistro={salvarRegistro} />}
        {aba === "troca" && <Troca onSalvarRegistro={salvarRegistro} />}
        {aba === "controle" && (
          <ControleInterno
            registros={registros}
            onRemoverRegistro={removerRegistro}
          />
        )}
      </div>
    </main>
  );
}