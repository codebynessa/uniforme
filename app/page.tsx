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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Peça</th>
            <th className="border p-2 text-left">Tamanho</th>
            <th className="border p-2 text-center">Qtd</th>
            {mostrarAcoes && <th className="border p-2 text-center">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td className="border p-2">{item.nome}</td>
              <td className="border p-2">
                {mostrarAcoes ? (
                  <input
                    className="w-full rounded border p-1"
                    value={item.tamanho}
                    onChange={(e) => onAlterarTamanho?.(index, e.target.value)}
                    placeholder="Ex: M, 42, 39, Único"
                  />
                ) : (
                  item.tamanho || "-"
                )}
              </td>
              <td className="border p-2 text-center">
                {mostrarAcoes ? (
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded border p-1 text-center"
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
                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemover?.(index)}
                    className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
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

function EtiquetaSaco({
  tipo,
  nome,
  re,
  posto,
  responsavel,
  cargoLabel,
  itens,
}: {
  tipo: TipoRegistro;
  nome: string;
  re: string;
  posto: string;
  responsavel: string;
  cargoLabel: string;
  itens: ItemFormulario[];
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

        <div className="rounded-md border px-3 py-2 md:col-span-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-600">
            Responsável pela retirada
          </p>
          <p className="text-sm font-semibold leading-tight">
            {responsavel || "________________"}
          </p>
        </div>
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px] md:text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-[8%] border p-1.5 text-left">Data</th>
            <th className="w-[8%] border p-1.5 text-left">Tipo</th>
            <th className="w-[12%] border p-1.5 text-left">Colaborador</th>
            <th className="w-[6%] border p-1.5 text-left">RE</th>
            <th className="w-[10%] border p-1.5 text-left">Posto</th>
            <th className="w-[31%] border p-1.5 text-left">Peças</th>
            <th className="w-[13%] border p-1.5 text-left">Responsável</th>
            <th className="w-[12%] border p-1.5 text-left">Assinatura</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={8} className="border p-3 text-center text-gray-500">
                Nenhum registro salvo ainda.
              </td>
            </tr>
          ) : (
            registros.map((registro) => (
              <tr key={registro.id} className="break-inside-avoid">
                <td className="border p-1.5 align-top">{registro.data}</td>
                <td className="border p-1.5 align-top font-medium">{registro.tipo}</td>
                <td className="border p-1.5 align-top font-medium">
                  {registro.colaborador}
                </td>
                <td className="border p-1.5 align-top">{registro.re}</td>
                <td className="border p-1.5 align-top">{registro.posto}</td>
                <td className="border p-1.5 align-top whitespace-pre-line leading-4">
                  {resumirItensInterno(registro.itens)}
                </td>
                <td className="border p-1.5 align-top">{registro.responsavel}</td>
                <td className="border p-1.5 align-top">
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
        <div className="no-print rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Admissão</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome do colaborador</label>
              <input
                className="w-full rounded-md border p-2"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">RE</label>
              <input
                className="w-full rounded-md border p-2"
                value={re}
                onChange={(e) => setRe(e.target.value)}
                placeholder="Digite o RE"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Posto do colaborador</label>
              <input
                className="w-full rounded-md border p-2"
                value={posto}
                onChange={(e) => setPosto(e.target.value)}
                placeholder="Digite o posto"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Responsável pela retirada</label>
              <select
                className="w-full rounded-md border p-2"
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
              <label className="text-sm font-medium">Cargo</label>
              <select
                className="w-full rounded-md border p-2"
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

            <div className="rounded-xl border bg-gray-50 p-4">
              <h3 className="mb-3 font-medium">Adicionar item extra</h3>

              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  className="w-full rounded-md border p-2"
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
                  className="rounded-md bg-gray-900 px-4 py-2 text-white"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <div className="text-lg font-bold md:mr-auto">
                Total de peças: {totalItens}
              </div>

              <button
                onClick={salvarEntrega}
                className="rounded-md bg-emerald-600 px-4 py-2 text-white"
              >
                Salvar no controle interno
              </button>

              <button
                onClick={imprimirEtiqueta}
                className="rounded-md bg-black px-4 py-2 text-white"
              >
                Imprimir etiqueta do saco
              </button>
            </div>
          </div>
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
        <div className="no-print rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Controle Interno</h2>

            <button
              onClick={imprimirControleInterno}
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              Imprimir folha interna
            </button>
          </div>

          <TabelaControleInterno registros={registros} />

          {registros.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Remover registro salvo</h3>
              <div className="flex flex-wrap gap-2">
                {registros.map((registro) => (
                  <button
                    key={registro.id}
                    type="button"
                    onClick={() => onRemoverRegistro(registro.id)}
                    className="rounded bg-red-100 px-3 py-2 text-sm text-red-700"
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

function Troca() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Troca</h2>
      <p className="mt-2 text-sm text-gray-600">
        A próxima etapa é montar a troca com vale, peças manuais e impressão.
      </p>
    </div>
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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="no-print">
          <h1 className="text-3xl font-bold">Controle de Uniformes</h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className={`rounded-md px-4 py-2 ${
                aba === "admissao" ? "bg-black text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setAba("admissao")}
            >
              Admissão
            </button>

            <button
              className={`rounded-md px-4 py-2 ${
                aba === "troca" ? "bg-black text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setAba("troca")}
            >
              Troca
            </button>

            <button
              className={`rounded-md px-4 py-2 ${
                aba === "controle" ? "bg-black text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setAba("controle")}
            >
              Controle interno
            </button>
          </div>
        </div>

        {aba === "admissao" && <Admissao onSalvarRegistro={salvarRegistro} />}
        {aba === "troca" && <Troca />}
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