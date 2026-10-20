import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Privacidade — Biomedicina Visual" },
    { name: "description", content: "Uso de dados de navegação e escolhas de rastreamento da Biomedicina Visual." },
    { property: "og:title", content: "Privacidade — Biomedicina Visual" },
    { property: "og:description", content: "Informações sobre medição de anúncios, UTMs e opções de privacidade." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacy,
});

function Privacy() {
  return <main className="mx-auto max-w-3xl space-y-6 px-6 py-12 text-foreground">
    <Link to="/" className="underline">Voltar à página</Link>
    <h1 className="text-3xl font-bold">Política de Privacidade</h1>
    <p>Utilizamos a UTMify para medir visitas, origem dos anúncios e encaminhamentos para o checkout. Quando permitido, seus scripts podem tratar endereço IP, informações do navegador e dispositivo, páginas visitadas, identificadores de cookies e parâmetros de campanha (UTMs), para atribuição de vendas, medição e otimização de anúncios.</p>
    <p>Esses dados são compartilhados com a UTMify e podem ser encaminhados às plataformas de publicidade configuradas no serviço, como Facebook e Instagram (Meta). Não configuramos envio de e-mail, telefone ou outros dados de identificação do comprador nesta página.</p>
    <p>Não carregamos o pixel nem o rastreamento de UTM nas regiões que exigem consentimento prévio ou quando não conseguimos confirmar a localização. Não exibimos aviso de cookies. Também respeitamos a recusa salva neste navegador e sinais de não rastreamento suportados.</p>
    <p>Para identificar o país, consultamos primeiro este site. Se essa consulta estiver indisponível, consultamos a Cloudflare, que recebe seu endereço IP e informações técnicas da conexão. Essa consulta não envia cookies nem o endereço da página visitada. Se ambas falharem, o rastreamento permanece bloqueado.</p>
    <p>Você pode desativar o rastreamento neste navegador pelo botão abaixo. A escolha é salva localmente; a página é recarregada para interromper novos envios. Dados já enviados não são apagados por essa escolha. A compra e o checkout continuam disponíveis.</p>
    <Button variant="outline" onClick={() => { localStorage.setItem("landing-ad-opt-out", "true"); window.location.reload(); }}>Desativar rastreamento neste navegador</Button>
    <p>O checkout externo possui sua própria política de privacidade e tratamento de dados.</p>
  </main>;
}