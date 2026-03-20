"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type TipoRegistro = "Admissão" | "Troca";

type Responsavel = {
  id: string;
  nome: string;
  re: string;
};

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

type FuncaoKit = {
  id: string;
  nome: string;
  itens: { id: string; quantidade: number }[];
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

const RESPONSAVEIS_PADRAO: Responsavel[] = [
  { id: "resp-1", nome: "EVALDO DE MIRANDA BARROS", re: "14130" },
  { id: "resp-2", nome: "INES RODRIGUES DE SOUZA", re: "199631" },
  { id: "resp-3", nome: "OLGACIR MIRANDA FAGUNDES", re: "16100" },
];

const CATALOGO_PADRAO: ItemCatalogo[] = [
  { id: "camisa_mc", nome: "Camisa MC" },
  { id: "camisa_ml", nome: "Camisa ML" },
  { id: "calca", nome: "Calça" },
  { id: "coturno", nome: "Coturno" },
  { id: "jaqueta", nome: "Jaqueta" },
  { id: "capa_colete", nome: "Capa de Colete", tamanhoPadrao: "Único" },
  {
    id: "colete_laranja",
    nome: "Colete Refletivo Laranja",
    tamanhoPadrao: "Único",
  },
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
  {
    id: "capacete_azul",
    nome: "Capacete Azul Completo",
    tamanhoPadrao: "Único",
  },
  {
    id: "capacete_cinza",
    nome: "Capacete Cinza Completo",
    tamanhoPadrao: "Único",
  },
  { id: "oculos", nome: "Óculos de Segurança", tamanhoPadrao: "Único" },
  { id: "luva_vaqueta", nome: "Luva de Vaqueta" },
  { id: "luva_multitato", nome: "Luva Multitato" },
  {
    id: "protetor_concha",
    nome: "Protetor Auricular (Concha)",
    tamanhoPadrao: "Único",
  },
  {
    id: "protetor_facial",
    nome: "Protetor Facial",
    tamanhoPadrao: "Único",
  },
];

const FUNCOES_PADRAO: FuncaoKit[] = [
  {
    id: "vigilante",
    nome: "Vigilante",
    itens: [
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
  },
  {
    id: "jardineiro",
    nome: "Jardineiro",
    itens: [
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
  },
  {
    id: "auxiliar_limpeza",
    nome: "Auxiliar de Limpeza",
    itens: [
      { id: "camisa_mc", quantidade: 2 },
      { id: "calca", quantidade: 2 },
      { id: "botina", quantidade: 1 },
      { id: "bota_elastico", quantidade: 1 },
      { id: "colete_laranja", quantidade: 1 },
      { id: "oculos", quantidade: 1 },
      { id: "capacete_cinza", quantidade: 1 },
    ],
  },
  {
    id: "auxiliar_servicos_gerais",
    nome: "Auxiliar de Serviços Gerais",
    itens: [
      { id: "camisa_mc", quantidade: 2 },
      { id: "calca", quantidade: 2 },
      { id: "botina", quantidade: 1 },
      { id: "bota_elastico", quantidade: 1 },
      { id: "colete_laranja", quantidade: 1 },
      { id: "oculos", quantidade: 1 },
      { id: "capacete_cinza", quantidade: 1 },
    ],
  },
  {
    id: "vigia_florestal",
    nome: "Vigia Florestal",
    itens: [
      { id: "camisa_ml", quantidade: 2 },
      { id: "calca", quantidade: 2 },
      { id: "jaqueta", quantidade: 1 },
      { id: "bota_bombeiro", quantidade: 1 },
      { id: "colete_laranja", quantidade: 1 },
      { id: "bone", quantidade: 1 },
      { id: "cinturao", quantidade: 1 },
    ],
  },
];

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fieldClass() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";
}

function labelClass() {
  return "text-sm font-medium text-slate-700";
}

function cardClass() {
  return "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
}

function buttonPrimary() {
  return "rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800";
}

function buttonSuccess() {
  return "rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700";
}

function buttonDangerSoft() {
  return "rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100";
}

function badgeClass(tipo: TipoRegistro) {
  return tipo === "Admissão"
    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border border-amber-200 bg-amber-50 text-amber-700";
}

function montarItensDaFuncao(
  funcaoId: string,
  funcoes: FuncaoKit[],
  catalogo: ItemCatalogo[]
): ItemFormulario[] {
  const funcao = funcoes.find((f) => f.id === funcaoId);
  if (!funcao) return [];

  return funcao.itens.map((item) => {
    const peca = catalogo.find((p) => p.id === item.id);
    return {
      id: item.id,
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
      return `${item.nome}${tamanho} x${item.quantidade}`;
    })
    .join(" • ");
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
              <td className="border-b border-slate-100 p-3">{item.nome}</td>
              <td className="border-b border-slate-100 p-3">
                {mostrarAcoes ? (
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                    value={item.tamanho}
                    onChange={(e) => onAlterarTamanho?.(index, e.target.value)}
                    placeholder="Ex: M, 42, Único"
                  />
                ) : (
                  item.tamanho || "-"
                )}
              </td>
              <td className="border-b border-slate-100 p-3 text-center">
                {mostrarAcoes ? (
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded-xl border border-slate-200 px-2 py-1.5 text-center text-sm outline-none focus:border-slate-400"
                    value={item.quantidade}
                    onChange={(e) =>
                      onAlterarQuantidade?.(index, Number(e.target.value))
                    }
                  />
                ) : (
                  item.quantidade
                )}
              </td>
              {mostrarAcoes && (
                <td className="border-b border-slate-100 p-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemover?.(index)}
                    className={buttonDangerSoft()}
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
  cargo,
  responsavel,
  solicitante,
  totalItens,
}: {
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  cargo: string;
  responsavel: string;
  solicitante?: string;
  totalItens: number;
}) {
  return (
    <div className={`${cardClass()} space-y-4 no-print`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Resumo</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(
            tipo
          )}`}
        >
          {tipo}
        </span>
      </div>

      <div className="grid gap-3 text-sm">
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
            <p className="text-slate-500">Peças</p>
            <p className="font-semibold text-slate-900">{totalItens}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Posto</p>
          <p className="font-semibold text-slate-900">{posto || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Função</p>
          <p className="font-semibold text-slate-900">{cargo || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Responsável pela retirada</p>
          <p className="font-semibold text-slate-900">{responsavel || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">Responsável que solicitou</p>
          <p className="font-semibold text-slate-900">{solicitante || "-"}</p>
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
  solicitante,
  cargoLabel,
  itens,
  observacao,
}: {
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  responsavel: string;
  solicitante?: string;
  cargoLabel: string;
  itens: ItemFormulario[];
  observacao?: string;
}) {
  return (
    <section className="print-etiqueta hidden">
      <div className="mx-auto w-[190mm] bg-white text-black">
        <div className="border-2 border-black p-5">
          <div className="mb-4 border-b-2 border-black pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-wide">
                  CONTROLE DE UNIFORME
                </h2>
                <p className="text-[11px] uppercase tracking-[0.15em]">
                  Ficha de entrega / identificação do saco
                </p>
              </div>
              <div className="text-right text-[11px]">
                <p className="font-semibold">{tipo}</p>
                <p>{new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="col-span-2 rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Colaborador
              </p>
              <p className="text-[18px] font-bold leading-tight">
                {nome || "________________"}
              </p>
            </div>

            <div className="rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                RE
              </p>
              <p className="font-semibold">{re || "________________"}</p>
            </div>

            <div className="rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Posto
              </p>
              <p className="font-semibold">{posto || "________________"}</p>
            </div>

            <div className="col-span-2 rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Função
              </p>
              <p className="font-semibold">{cargoLabel || "________________"}</p>
            </div>

            <div className="col-span-2 rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Responsável pela retirada
              </p>
              <p className="font-semibold">
                {responsavel || "________________"}
              </p>
            </div>

            <div className="col-span-2 rounded-md border border-black px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Responsável que solicitou
              </p>
              <p className="font-semibold">
                {solicitante || "________________"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]">
              Itens entregues
            </h3>

            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-black px-2 py-1.5 text-left">
                    Peça
                  </th>
                  <th className="border border-black px-2 py-1.5 text-left">
                    Tamanho
                  </th>
                  <th className="border border-black px-2 py-1.5 text-center">
                    Qtd
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item, index) => (
                  <tr key={`${item.id}-${index}`}>
                    <td className="border border-black px-2 py-1.5 leading-tight">
                      {item.nome}
                    </td>
                    <td className="border border-black px-2 py-1.5 leading-tight">
                      {item.tamanho || "-"}
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center leading-tight">
                      {item.quantidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {observacao ? (
            <div className="mt-4 rounded-md border border-black px-3 py-2.5 text-[11px]">
              <p className="font-semibold">Observação:</p>
              <p>{observacao}</p>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="h-[52px] border-b border-black" />
            <p className="mt-2 text-[11px]">
              Assinatura do responsável pela retirada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CampoDocumento({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`doc-box ${className}`}>
      <span className="doc-label">{label}</span>
      <p className="doc-value">{value || "-"}</p>
    </div>
  );
}

function ControleInternoPrint({
  registros,
}: {
  registros: RegistroInterno[];
}) {
  return (
    <div className="print-doc">
      {registros.length === 0 ? (
        <div className="rounded-2xl border border-slate-300 bg-white p-4 text-center text-slate-500">
          Nenhum registro salvo ainda.
        </div>
      ) : (
        registros.map((registro, index) => (
          <article key={registro.id} className="doc-ficha doc-ficha-dupla">
            <header className="doc-header">
              <div className="doc-header-left">
                <h2>CONTROLE DE ENTREGA DE UNIFORMES</h2>
                <p className="doc-subtitle">
                  Documento interno para arquivamento
                </p>
              </div>

              <div className="doc-header-right">
                <div>
                  <span className="doc-label">Nº Registro</span>
                  <p className="doc-value">
                    {String(registros.length - index).padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <span className="doc-label">Data</span>
                  <p className="doc-value">{registro.data}</p>
                </div>
              </div>
            </header>

            <section className="doc-grid">
              <CampoDocumento label="Tipo" value={registro.tipo} />
              <CampoDocumento label="RE" value={registro.re} />
              <CampoDocumento
                label="Colaborador"
                value={registro.colaborador}
                className="doc-col-span-2"
              />
              <CampoDocumento label="Posto" value={registro.posto} />
              <CampoDocumento label="Função" value={registro.cargo} />
            </section>

            <section className="doc-section">
              <div className="doc-box">
                <span className="doc-label">Peças entregues</span>
                <p className="doc-value destaque">
                  {resumirItensInterno(registro.itens)}
                </p>
              </div>
            </section>

            <section className="doc-grid">
              <CampoDocumento
                label="Responsável pela retirada"
                value={registro.responsavel}
              />
              <CampoDocumento
                label="Responsável que solicitou"
                value={registro.solicitante || "-"}
              />
            </section>

            <section className="doc-signature">
              <div className="doc-sign-line" />
              <p>Assinatura do responsável pela retirada</p>
            </section>
          </article>
        ))
      )}
    </div>
  );
}

function AbaAdmissao({
  funcoes,
  catalogo,
  responsaveis,
  onSalvarRegistro,
}: {
  funcoes: FuncaoKit[];
  catalogo: ItemCatalogo[];
  responsaveis: Responsavel[];
  onSalvarRegistro: (registro: RegistroInterno) => void;
}) {
  const [nome, setNome] = useState("");
  const [re, setRe] = useState("");
  const [posto, setPosto] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [funcaoId, setFuncaoId] = useState(funcoes[0]?.id || "");
  const [itemExtraId, setItemExtraId] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([]);
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "etiqueta">(
    "nenhum"
  );

  useEffect(() => {
    setItens(montarItensDaFuncao(funcaoId, funcoes, catalogo));
  }, [funcaoId, funcoes, catalogo]);

  const totalItens = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens]
  );

  const funcaoLabel = useMemo(
    () => funcoes.find((f) => f.id === funcaoId)?.nome || "",
    [funcoes, funcaoId]
  );

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
      id: uid("registro"),
      data: new Date().toLocaleDateString("pt-BR"),
      tipo: "Admissão",
      colaborador: nome,
      re,
      posto,
      cargo: funcaoLabel,
      responsavel,
      solicitante,
      itens,
    };
  }

  function salvarEntrega() {
    onSalvarRegistro(montarRegistro());
    alert("Entrega salva no controle interno.");
  }

  function imprimirEtiqueta() {
    setModoImpressao("etiqueta");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 150);
  }

  return (
    <div className={modoImpressao === "etiqueta" ? "somente-etiqueta" : ""}>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className={`${cardClass()} no-print`}>
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Admissão
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass()}>Nome do colaborador</label>
              <input
                className={fieldClass()}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>RE</label>
              <input
                className={fieldClass()}
                value={re}
                onChange={(e) => setRe(e.target.value)}
                placeholder="Digite o RE"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>Posto do colaborador</label>
              <input
                className={fieldClass()}
                value={posto}
                onChange={(e) => setPosto(e.target.value)}
                placeholder="Digite o posto"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>
                Responsável pela retirada
              </label>
              <select
                className={fieldClass()}
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              >
                <option value="">Selecione</option>
                {responsaveis.map((item) => (
                  <option key={item.id} value={`${item.nome} - RE ${item.re}`}>
                    {item.nome} - RE {item.re}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>
                Responsável que solicitou
              </label>
              <input
                className={fieldClass()}
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                placeholder="Quem solicitou os uniformes"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>Função</label>
              <select
                className={fieldClass()}
                value={funcaoId}
                onChange={(e) => setFuncaoId(e.target.value)}
              >
                {funcoes.map((funcao) => (
                  <option key={funcao.id} value={funcao.id}>
                    {funcao.nome}
                  </option>
                ))}
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
              <h3 className="mb-3 font-medium text-slate-900">
                Adicionar item extra
              </h3>

              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  className={fieldClass()}
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
                  className={buttonPrimary()}
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <button onClick={salvarEntrega} className={buttonSuccess()}>
                Salvar no controle interno
              </button>

              <button onClick={imprimirEtiqueta} className={buttonPrimary()}>
                Imprimir folha do uniforme
              </button>
            </div>
          </div>
        </div>

        <ResumoLateral
          tipo="Admissão"
          nome={nome}
          re={re}
          posto={posto}
          cargo={funcaoLabel}
          responsavel={responsavel}
          solicitante={solicitante}
          totalItens={totalItens}
        />
      </div>

      <EtiquetaSaco
        tipo="Admissão"
        nome={nome}
        re={re}
        posto={posto}
        responsavel={responsavel}
        solicitante={solicitante}
        cargoLabel={funcaoLabel}
        itens={itens}
      />
    </div>
  );
}

function AbaTroca({
  catalogo,
  responsaveis,
  onSalvarRegistro,
}: {
  catalogo: ItemCatalogo[];
  responsaveis: Responsavel[];
  onSalvarRegistro: (registro: RegistroInterno) => void;
}) {
  const [nome, setNome] = useState("");
  const [re, setRe] = useState("");
  const [posto, setPosto] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [itemId, setItemId] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([]);
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "etiqueta">(
    "nenhum"
  );

  const totalItens = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens]
  );

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
      id: uid("registro"),
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
    onSalvarRegistro(montarRegistro());
    alert("Troca salva no controle interno.");
  }

  function imprimirEtiqueta() {
    setModoImpressao("etiqueta");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 150);
  }

  return (
    <div className={modoImpressao === "etiqueta" ? "somente-etiqueta" : ""}>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className={`${cardClass()} no-print`}>
          <h2 className="mb-5 text-xl font-semibold text-slate-900">Troca</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass()}>Nome do colaborador</label>
              <input
                className={fieldClass()}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>RE</label>
              <input
                className={fieldClass()}
                value={re}
                onChange={(e) => setRe(e.target.value)}
                placeholder="Digite o RE"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>Posto do colaborador</label>
              <input
                className={fieldClass()}
                value={posto}
                onChange={(e) => setPosto(e.target.value)}
                placeholder="Digite o posto"
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass()}>
                Responsável que solicitou
              </label>
              <input
                className={fieldClass()}
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                placeholder="Quem solicitou a troca"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className={labelClass()}>
                Responsável pela retirada
              </label>
              <select
                className={fieldClass()}
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              >
                <option value="">Selecione</option>
                {responsaveis.map((item) => (
                  <option key={item.id} value={`${item.nome} - RE ${item.re}`}>
                    {item.nome} - RE {item.re}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 font-medium text-slate-900">
                Adicionar peça da troca
              </h3>

              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  className={fieldClass()}
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
                  className={buttonPrimary()}
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
              <button onClick={salvarTroca} className={buttonSuccess()}>
                Salvar no controle interno
              </button>

              <button onClick={imprimirEtiqueta} className={buttonPrimary()}>
                Imprimir folha do uniforme
              </button>
            </div>
          </div>
        </div>

        <ResumoLateral
          tipo="Troca"
          nome={nome}
          re={re}
          posto={posto}
          cargo="Troca de uniforme"
          responsavel={responsavel}
          solicitante={solicitante}
          totalItens={totalItens}
        />
      </div>

      <EtiquetaSaco
        tipo="Troca"
        nome={nome}
        re={re}
        posto={posto}
        responsavel={responsavel}
        solicitante={solicitante}
        cargoLabel="Troca de uniforme"
        itens={itens}
        observacao="As peças antigas devem ser devolvidas em até 30 dias, conforme controle interno do setor."
      />
    </div>
  );
}

function AbaControleInterno({
  registros,
  onRemoverRegistro,
}: {
  registros: RegistroInterno[];
  onRemoverRegistro: (id: string) => void;
}) {
  const [modoImpressao, setModoImpressao] = useState<"nenhum" | "interno">(
    "nenhum"
  );

  function imprimirControleInterno() {
    setModoImpressao("interno");
    setTimeout(() => {
      window.print();
      setModoImpressao("nenhum");
    }, 150);
  }

  return (
    <div className={modoImpressao === "interno" ? "somente-controle" : ""}>
      <div className={`${cardClass()} no-print`}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Controle Interno
            </h2>
            <p className="text-sm text-slate-500">
              Histórico consolidado de admissões e trocas
            </p>
          </div>

          <button
            onClick={imprimirControleInterno}
            className={buttonPrimary()}
          >
            Imprimir folha interna
          </button>
        </div>

        {registros.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
            Nenhum registro salvo ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {registros.map((registro) => (
              <div
                key={registro.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {registro.colaborador || "Sem nome"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {registro.tipo} • {registro.data}
                    </p>
                  </div>

                  <div className="text-sm text-slate-600">
                    <p>RE: {registro.re || "-"}</p>
                    <p>Posto: {registro.posto || "-"}</p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-700">
                  <p>
                    <span className="font-medium">Função:</span>{" "}
                    {registro.cargo || "-"}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Peças:</span>{" "}
                    {resumirItensInterno(registro.itens)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {registros.length > 0 && (
          <div className="mt-5 space-y-2">
            <h3 className="font-medium text-slate-900">Remover registro salvo</h3>
            <div className="flex flex-wrap gap-2">
              {registros.map((registro) => (
                <button
                  key={registro.id}
                  type="button"
                  onClick={() => onRemoverRegistro(registro.id)}
                  className={buttonDangerSoft()}
                >
                  Remover {registro.colaborador || "sem nome"} - {registro.data}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="print-controle hidden bg-white">
        <div className="mx-auto w-full max-w-[190mm] text-black">
          <div className="mb-4 border-b border-black pb-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  CONTROLE INTERNO DE UNIFORMES
                </h1>
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                  Documento para arquivamento em fichário
                </p>
              </div>

              <div className="text-right text-[10px]">
                <p className="font-semibold">Data da impressão</p>
                <p>{new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          </div>

          <ControleInternoPrint registros={registros} />
        </div>
      </section>
    </div>
  );
}

function AbaCadastros({
  catalogo,
  setCatalogo,
  responsaveis,
  setResponsaveis,
  funcoes,
  setFuncoes,
}: {
  catalogo: ItemCatalogo[];
  setCatalogo: Dispatch<SetStateAction<ItemCatalogo[]>>;
  responsaveis: Responsavel[];
  setResponsaveis: Dispatch<SetStateAction<Responsavel[]>>;
  funcoes: FuncaoKit[];
  setFuncoes: Dispatch<SetStateAction<FuncaoKit[]>>;
}) {
  const [novaPecaNome, setNovaPecaNome] = useState("");
  const [novoTamanhoPadrao, setNovoTamanhoPadrao] = useState("");
  const [novoResponsavelNome, setNovoResponsavelNome] = useState("");
  const [novoResponsavelRe, setNovoResponsavelRe] = useState("");
  const [novaFuncaoNome, setNovaFuncaoNome] = useState("");
  const [funcaoSelecionada, setFuncaoSelecionada] = useState(
    funcoes[0]?.id || ""
  );
  const [pecaKitId, setPecaKitId] = useState("");
  const [pecaKitQtd, setPecaKitQtd] = useState(1);

  useEffect(() => {
    if (!funcoes.find((f) => f.id === funcaoSelecionada)) {
      setFuncaoSelecionada(funcoes[0]?.id || "");
    }
  }, [funcoes, funcaoSelecionada]);

  function adicionarPecaCatalogo() {
    if (!novaPecaNome.trim()) return;

    const id = novaPecaNome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    if (catalogo.some((item) => item.id === id)) {
      alert("Já existe uma peça com nome parecido.");
      return;
    }

    setCatalogo((atual) => [
      ...atual,
      {
        id: id || uid("peca"),
        nome: novaPecaNome.trim(),
        tamanhoPadrao: novoTamanhoPadrao.trim() || undefined,
      },
    ]);

    setNovaPecaNome("");
    setNovoTamanhoPadrao("");
  }

  function removerPecaCatalogo(id: string) {
    setCatalogo((atual) => atual.filter((item) => item.id !== id));
    setFuncoes((atuais) =>
      atuais.map((funcao) => ({
        ...funcao,
        itens: funcao.itens.filter((item) => item.id !== id),
      }))
    );
  }

  function adicionarResponsavel() {
    if (!novoResponsavelNome.trim() || !novoResponsavelRe.trim()) return;

    setResponsaveis((atual) => [
      ...atual,
      {
        id: uid("resp"),
        nome: novoResponsavelNome.trim(),
        re: novoResponsavelRe.trim(),
      },
    ]);

    setNovoResponsavelNome("");
    setNovoResponsavelRe("");
  }

  function removerResponsavel(id: string) {
    setResponsaveis((atual) => atual.filter((item) => item.id !== id));
  }

  function adicionarFuncao() {
    if (!novaFuncaoNome.trim()) return;

    const nova: FuncaoKit = {
      id: uid("funcao"),
      nome: novaFuncaoNome.trim(),
      itens: [],
    };

    setFuncoes((atual) => [...atual, nova]);
    setFuncaoSelecionada(nova.id);
    setNovaFuncaoNome("");
  }

  function removerFuncao(id: string) {
    setFuncoes((atual) => atual.filter((item) => item.id !== id));
  }

  function adicionarPecaAoKit() {
    if (!funcaoSelecionada || !pecaKitId) return;

    setFuncoes((atual) =>
      atual.map((funcao) => {
        if (funcao.id !== funcaoSelecionada) return funcao;

        const existente = funcao.itens.find((item) => item.id === pecaKitId);

        if (existente) {
          return {
            ...funcao,
            itens: funcao.itens.map((item) =>
              item.id === pecaKitId
                ? { ...item, quantidade: item.quantidade + pecaKitQtd }
                : item
            ),
          };
        }

        return {
          ...funcao,
          itens: [...funcao.itens, { id: pecaKitId, quantidade: pecaKitQtd }],
        };
      })
    );

    setPecaKitId("");
    setPecaKitQtd(1);
  }

  function alterarQuantidadeKit(
    funcaoId: string,
    itemId: string,
    quantidade: number
  ) {
    const qtd = Number.isNaN(quantidade) || quantidade < 1 ? 1 : quantidade;

    setFuncoes((atual) =>
      atual.map((funcao) =>
        funcao.id === funcaoId
          ? {
              ...funcao,
              itens: funcao.itens.map((item) =>
                item.id === itemId ? { ...item, quantidade: qtd } : item
              ),
            }
          : funcao
      )
    );
  }

  function removerPecaDoKit(funcaoId: string, itemId: string) {
    setFuncoes((atual) =>
      atual.map((funcao) =>
        funcao.id === funcaoId
          ? {
              ...funcao,
              itens: funcao.itens.filter((item) => item.id !== itemId),
            }
          : funcao
      )
    );
  }

  const funcaoAtual = funcoes.find((f) => f.id === funcaoSelecionada);

  return (
    <div className="grid gap-6 xl:grid-cols-2 no-print">
      <div className={`${cardClass()} space-y-6`}>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Cadastro de peças
          </h2>
          <p className="text-sm text-slate-500">
            Adicione novas peças ao catálogo do sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className={labelClass()}>Nome da peça</label>
            <input
              className={fieldClass()}
              value={novaPecaNome}
              onChange={(e) => setNovaPecaNome(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass()}>Tamanho padrão</label>
            <input
              className={fieldClass()}
              value={novoTamanhoPadrao}
              onChange={(e) => setNovoTamanhoPadrao(e.target.value)}
              placeholder="Ex: Único"
            />
          </div>
        </div>

        <button onClick={adicionarPecaCatalogo} className={buttonPrimary()}>
          Cadastrar peça
        </button>

        <div className="space-y-2">
          {catalogo.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.nome}</p>
                <p className="text-sm text-slate-500">
                  Tamanho padrão: {item.tamanhoPadrao || "-"}
                </p>
              </div>

              <button
                onClick={() => removerPecaCatalogo(item.id)}
                className={buttonDangerSoft()}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardClass()} space-y-6`}>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Cadastro de responsáveis
          </h2>
          <p className="text-sm text-slate-500">
            Gerencie quem pode retirar os uniformes
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className={labelClass()}>Nome</label>
            <input
              className={fieldClass()}
              value={novoResponsavelNome}
              onChange={(e) => setNovoResponsavelNome(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass()}>RE</label>
            <input
              className={fieldClass()}
              value={novoResponsavelRe}
              onChange={(e) => setNovoResponsavelRe(e.target.value)}
            />
          </div>
        </div>

        <button onClick={adicionarResponsavel} className={buttonPrimary()}>
          Cadastrar responsável
        </button>

        <div className="space-y-2">
          {responsaveis.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.nome}</p>
                <p className="text-sm text-slate-500">RE {item.re}</p>
              </div>

              <button
                onClick={() => removerResponsavel(item.id)}
                className={buttonDangerSoft()}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardClass()} space-y-6 xl:col-span-2`}>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Cadastro de funções e kits
          </h2>
          <p className="text-sm text-slate-500">
            Crie funções e defina quais uniformes cada uma recebe
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-1">
            <label className={labelClass()}>Nova função</label>
            <input
              className={fieldClass()}
              value={novaFuncaoNome}
              onChange={(e) => setNovaFuncaoNome(e.target.value)}
              placeholder="Ex: Vigia patrimonial"
            />
          </div>

          <div className="flex items-end">
            <button onClick={adicionarFuncao} className={buttonPrimary()}>
              Cadastrar função
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className={labelClass()}>Função selecionada</label>
              <select
                className={fieldClass()}
                value={funcaoSelecionada}
                onChange={(e) => setFuncaoSelecionada(e.target.value)}
              >
                {funcoes.map((funcao) => (
                  <option key={funcao.id} value={funcao.id}>
                    {funcao.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {funcoes.map((funcao) => (
                <div
                  key={funcao.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{funcao.nome}</p>
                    <p className="text-sm text-slate-500">
                      {funcao.itens.length} item(ns) no kit
                    </p>
                  </div>

                  <button
                    onClick={() => removerFuncao(funcao.id)}
                    className={buttonDangerSoft()}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 font-medium text-slate-900">
                Adicionar peça ao kit
              </h3>

              <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
                <select
                  className={fieldClass()}
                  value={pecaKitId}
                  onChange={(e) => setPecaKitId(e.target.value)}
                >
                  <option value="">Selecione uma peça</option>
                  {catalogo.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  className={fieldClass()}
                  value={pecaKitQtd}
                  onChange={(e) => setPecaKitQtd(Number(e.target.value))}
                />

                <button onClick={adicionarPecaAoKit} className={buttonPrimary()}>
                  Adicionar
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 px-4 py-3">
                <h3 className="font-medium text-slate-900">
                  Kit da função: {funcaoAtual?.nome || "-"}
                </h3>
              </div>

              <div className="space-y-2 p-4">
                {!funcaoAtual || funcaoAtual.itens.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Nenhuma peça cadastrada nessa função.
                  </p>
                ) : (
                  funcaoAtual.itens.map((item) => {
                    const peca = catalogo.find((p) => p.id === item.id);

                    return (
                      <div
                        key={item.id}
                        className="grid items-center gap-3 rounded-2xl border border-slate-200 p-3 md:grid-cols-[1fr_120px_auto]"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {peca?.nome || item.id}
                          </p>
                        </div>

                        <input
                          type="number"
                          min={1}
                          className={fieldClass()}
                          value={item.quantidade}
                          onChange={(e) =>
                            alterarQuantidadeKit(
                              funcaoAtual.id,
                              item.id,
                              Number(e.target.value)
                            )
                          }
                        />

                        <button
                          onClick={() =>
                            removerPecaDoKit(funcaoAtual.id, item.id)
                          }
                          className={buttonDangerSoft()}
                        >
                          Remover
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [aba, setAba] = useState<
    "admissao" | "troca" | "controle" | "cadastros"
  >("admissao");
  const [registros, setRegistros] = useState<RegistroInterno[]>([]);
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>(CATALOGO_PADRAO);
  const [responsaveis, setResponsaveis] =
    useState<Responsavel[]>(RESPONSAVEIS_PADRAO);
  const [funcoes, setFuncoes] = useState<FuncaoKit[]>(FUNCOES_PADRAO);

  useEffect(() => {
    const salvoRegistros = localStorage.getItem(
      "controle-interno-uniformes"
    );
    const salvoCatalogo = localStorage.getItem(
      "cadastro-catalogo-uniformes"
    );
    const salvoResponsaveis = localStorage.getItem(
      "cadastro-responsaveis-uniformes"
    );
    const salvoFuncoes = localStorage.getItem(
      "cadastro-funcoes-uniformes"
    );

    if (salvoRegistros) setRegistros(JSON.parse(salvoRegistros));
    if (salvoCatalogo) setCatalogo(JSON.parse(salvoCatalogo));
    if (salvoResponsaveis) setResponsaveis(JSON.parse(salvoResponsaveis));
    if (salvoFuncoes) setFuncoes(JSON.parse(salvoFuncoes));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "controle-interno-uniformes",
      JSON.stringify(registros)
    );
  }, [registros]);

  useEffect(() => {
    localStorage.setItem(
      "cadastro-catalogo-uniformes",
      JSON.stringify(catalogo)
    );
  }, [catalogo]);

  useEffect(() => {
    localStorage.setItem(
      "cadastro-responsaveis-uniformes",
      JSON.stringify(responsaveis)
    );
  }, [responsaveis]);

  useEffect(() => {
    localStorage.setItem(
      "cadastro-funcoes-uniformes",
      JSON.stringify(funcoes)
    );
  }, [funcoes]);

  function salvarRegistro(registro: RegistroInterno) {
    setRegistros((atual) => [registro, ...atual]);
    setAba("controle");
  }

  function removerRegistro(id: string) {
    setRegistros((atual) => atual.filter((item) => item.id !== id));
  }

  const abas = [
    { id: "admissao", label: "Admissão" },
    { id: "troca", label: "Troca" },
    { id: "controle", label: "Controle interno" },
    { id: "cadastros", label: "Cadastros" },
  ] as const;

  return (
    <>
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 10mm;
        }

        @media print {
          html,
          body {
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          .print-etiqueta,
          .print-etiqueta *,
          .print-controle,
          .print-controle * {
            visibility: visible !important;
          }

          .print-etiqueta,
          .print-controle {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }

          .no-print {
            display: none !important;
          }

          .print-doc {
            width: 190mm;
            margin: 0 auto;
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
          }

          .doc-ficha-dupla {
            height: 128mm;
            break-inside: avoid;
            page-break-inside: avoid;
            overflow: hidden;
            margin-bottom: 4mm;
          }

          .doc-ficha-dupla:nth-child(2n) {
            margin-bottom: 0;
          }
        }

        .print-doc {
          width: 190mm;
          margin: 0 auto;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
        }

        .doc-ficha {
          border: 1px solid #000;
          padding: 10px;
          background: #fff;
          box-sizing: border-box;
        }

        .doc-ficha-dupla {
          min-height: 128mm;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1.5px solid #000;
          padding-bottom: 6px;
          margin-bottom: 8px;
          gap: 10px;
        }

        .doc-header-left h2 {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }

        .doc-subtitle {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .doc-header-right {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .doc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .doc-col-span-2 {
          grid-column: span 2;
        }

        .doc-section {
          margin-top: 8px;
        }

        .doc-box {
          border: 1px solid #000;
          padding: 6px 8px;
          min-height: 44px;
          background: #fff;
          box-sizing: border-box;
        }

        .doc-label {
          display: block;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 3px;
        }

        .doc-value {
          font-size: 11px;
          line-height: 1.25;
          word-break: break-word;
        }

        .destaque {
          font-weight: 700;
        }

        .doc-signature {
          margin-top: 14px;
          text-align: center;
        }

        .doc-sign-line {
          width: 68%;
          height: 34px;
          border-bottom: 1px solid #000;
          margin: 0 auto;
        }

        .doc-signature p {
          font-size: 10px;
          margin-top: 4px;
        }
      `}</style>

      <main className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="no-print">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <h1 className="text-3xl font-bold tracking-tight">
                Controle de Uniformes
              </h1>
              <p className="mt-2 text-sm text-slate-200">
                Gestão de admissões, trocas, impressões, controle interno e
                cadastros.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {abas.map((item) => (
                <button
                  key={item.id}
                  className={`rounded-2xl px-5 py-2.5 text-sm font-medium transition ${
                    aba === item.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setAba(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {aba === "admissao" && (
            <AbaAdmissao
              funcoes={funcoes}
              catalogo={catalogo}
              responsaveis={responsaveis}
              onSalvarRegistro={salvarRegistro}
            />
          )}

          {aba === "troca" && (
            <AbaTroca
              catalogo={catalogo}
              responsaveis={responsaveis}
              onSalvarRegistro={salvarRegistro}
            />
          )}

          {aba === "controle" && (
            <AbaControleInterno
              registros={registros}
              onRemoverRegistro={removerRegistro}
            />
          )}

          {aba === "cadastros" && (
            <AbaCadastros
              catalogo={catalogo}
              setCatalogo={setCatalogo}
              responsaveis={responsaveis}
              setResponsaveis={setResponsaveis}
              funcoes={funcoes}
              setFuncoes={setFuncoes}
            />
          )}
        </div>
      </main>
    </>
  );
}