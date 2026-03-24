export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export const quizData: Record<string, Question[]> = {
    "1": [ // Trilha 1: Renda Fixa
        {
            id: "1_1",
            text: "Qual é a principal função da Reserva de Emergência?",
            options: [
                "Buscar a maior rentabilidade possível em curto prazo.",
                "Garantir segurança e rápido acesso financeiro em caso de imprevistos.",
                "Investir em ações de alto risco na Bolsa de Valores.",
                "Comprar bens de consumo como carros e imóveis."
            ],
            correctAnswerIndex: 1,
            explanation: "A reserva de emergência serve como um colchão de segurança para imprevistos (ex: saúde, desemprego), por isso deve estar em um investimento seguro e com liquidez diária."
        },
        {
            id: "1_2",
            text: "Onde NÃO é recomendado deixar a sua Reserva de Emergência?",
            options: [
                "Tesouro Selic",
                "CDB com liquidez diária (100% do CDI)",
                "Fundo DI com liquidez diária",
                "Ações na Bolsa de Valores"
            ],
            correctAnswerIndex: 3,
            explanation: "Ações têm alta volatilidade. Se você precisar do dinheiro em uma emergência e as ações estiverem em queda, você terá prejuízo no resgate."
        },
        {
            id: "1_3",
            text: "O que acontece com o seu dinheiro na Poupança ao longo do tempo se a inflação for maior que o rendimento dela?",
            options: [
                "Ele se multiplica rapidamente.",
                "Ele perde poder de compra.",
                "O governo confisca o valor extra.",
                "O banco aumenta o rendimento automaticamente."
            ],
            correctAnswerIndex: 1,
            explanation: "Se a inflação sobe mais que o rendimento da poupança, o seu dinheiro passa a valer menos no \"mundo real\", ou seja, você perde poder de compra."
        },
        {
            id: "1_4",
            text: "O que é o Tesouro Direto?",
            options: [
                "Um banco digital do Governo Federal.",
                "Um programa de venda de títulos públicos do Governo Federal para pessoas físicas.",
                "Um tipo de criptomoeda garantida pelo Brasil.",
                "Um título de capitalização oferecido pelos bancos."
            ],
            correctAnswerIndex: 1,
            explanation: "É uma plataforma que permite a qualquer pessoa física emprestar dinheiro para o Governo Federal comprando títulos públicos, recebendo juros em troca."
        },
        {
            id: "1_5",
            text: "Qual título do Tesouro Direto é o mais indicado para a Reserva de Emergência?",
            options: [
                "Tesouro IPCA+",
                "Tesouro Prefixado",
                "Tesouro Renda+ Aposentadoria Extra",
                "Tesouro Selic"
            ],
            correctAnswerIndex: 3,
            explanation: "O Tesouro Selic quase não sofre marcação a mercado e você não perde dinheiro se resgatar antes do prazo, sendo ideal para a reserva de emergência."
        },
        {
            id: "1_6",
            text: "Como funciona a rentabilidade do Tesouro IPCA+?",
            options: [
                "Rende sempre o mesmo valor fixo todos os anos.",
                "Rende de acordo com os ganhos da Bolsa de Valores.",
                "Garante um ganho real acima da inflação oficial (IPCA) mais uma taxa prefixada.",
                "Rende apenas se o governo tiver lucro no ano."
            ],
            correctAnswerIndex: 2,
            explanation: "O IPCA+ paga a variação da inflação (IPCA) somada a uma taxa adicional, garantindo que o seu dinheiro não perca valor para o aumento dos preços a longo prazo."
        },
        {
            id: "1_7",
            text: "O que significa a sigla CDB?",
            options: [
                "Certificado de Depósito Bancário",
                "Certidão de Débito Bancário",
                "Cobrança Direta de Bancos",
                "Cadastro de Dinheiro no Banco"
            ],
            correctAnswerIndex: 0,
            explanation: "CDB é um título emitido pelos bancos para captar dinheiro. Ao investir num CDB, você está emprestando dinheiro para o banco."
        },
        {
            id: "1_8",
            text: "O que você deve procurar ao escolher um CDB para reserva de emergência?",
            options: [
                "Vencimento para daqui a 5 anos e rentabilidade de 120% do CDI.",
                "Liquidez Diária e pagar no mínimo 100% do CDI.",
                "Que não tenha cobrança de Imposto de Renda.",
                "O CDB do banco tradicional independente da taxa."
            ],
            correctAnswerIndex: 1,
            explanation: "Para reserva de emergência, o mais importante é conseguir resgatar o dinheiro no mesmo dia (liquidez diária) pagando uma taxa justa, geralmente 100% do CDI."
        },
        {
            id: "1_9",
            text: "O que é o FGC (Fundo Garantidor de Créditos)?",
            options: [
                "Um imposto cobrado sobre os rendimentos da poupança.",
                "Um fundo de investimentos gerido pelo governo.",
                "Uma proteção que garante até R$ 250 mil por CPF caso a instituição financeira quebre.",
                "A taxa que o banco cobra para você poder investir em CDB."
            ],
            correctAnswerIndex: 2,
            explanation: "O FGC traz segurança na Renda Fixa privada (CDBs, LCIs, LCAs). Se o banco fechar, o FGC devolve seu dinheiro até o limite de R$ 250 mil por banco e por CPF."
        },
        {
            id: "1_10",
            text: "Entre Poupança, Tesouro Selic e um CDB de liquidez diária a 100% do CDI, qual historicamente rende MENOS?",
            options: [
                "Tesouro Selic",
                "CDB",
                "Poupança",
                "Empate, todos rendem igual por serem renda fixa"
            ],
            correctAnswerIndex: 2,
            explanation: "Sob as regras atuais, se a taxa Selic for maior que 8,5% ao ano, a poupança rende 0,5% ao mês + TR, o que historicamente perde para o Tesouro Selic e CDBs 100% CDI."
        }
    ],
    "2": [ // Trilha 2: FIIs
        {
            id: "2_1",
            text: "O que são Fundos Imobiliários (FIIs)?",
            options: [
                "Empresas de construção civil negociadas na bolsa.",
                "Fundos que reúnem recursos de investidores para investir em empreendimentos ou títulos imobiliários.",
                "Financiamentos para compra da casa própria através do governo.",
                "Um tipo de aplicação em Renda Fixa do Banco Central."
            ],
            correctAnswerIndex: 1,
            explanation: "Os FIIs permitem que você invista no mercado imobiliário sem precisar comprar um imóvel inteiro, recebendo os aluguéis proporcionais às suas cotas."
        },
        {
            id: "2_2",
            text: "Qual a grande vantagem tributária dos FIIs para pessoas físicas no Brasil?",
            options: [
                "Você ganha um desconto no IPVA do seu carro.",
                "Os dividendos (rendimentos mensais) distribuídos são isentos de Imposto de Renda.",
                "Não precisa declarar no Imposto de Renda anual.",
                "Eles não pagam nenhuma taxa de administração para a Bolsa (B3)."
            ],
            correctAnswerIndex: 1,
            explanation: "Diferente dos aluguéis tradicionais que pagam carnê-leão, os dividendos recebidos mensalmente de FIIs não têm desconto de Imposto de Renda para pessoa física."
        },
        {
            id: "2_3",
            text: "Na análise de FIIs, o indicador P/VP (Preço sobre o Valor Patrimonial) abaixo de 1 geralmente indica que o Fundo está:",
            options: [
                "Sendo negociado com ágio (mais caro que o valor dos seus imóveis).",
                "Prestes a pedir falência no mercado.",
                "Sendo negociado com deságio (mais barato que o valor avaliado de seus imóveis).",
                "Aumentando drasticamente o pagamento dos aluguéis."
            ],
            correctAnswerIndex: 2,
            explanation: "Um P/VP = 1 significa que o preço está justo. Abaixo de 1 significa estaria 'em promoção', sendo vendido na bolsa por menos do que seu patrimônio real vale. Acima de 1, está caro."
        },
        {
            id: "2_4",
            text: "Para diversificar seu investimento, é interessante misturar FIIs de:",
            options: [
                "Criptomoedas e Poupança.",
                "O mesmo shopping center em São Paulo.",
                "Apenas fundos de Renda Fixa Tesouro Selic.",
                "Tijolo (imóveis físicos) e Papel (dívidas imobiliárias/CRIs)."
            ],
            correctAnswerIndex: 3,
            explanation: "Diversificar entre FIIs de Tijolo (shoppings, logísticos, lajes) e de Papel (Certificados de Recebíveis Imobiliários) equilibra proteção e altos dividendos."
        },
        {
            id: "2_5",
            text: "O que significa o indicador de Vacância em um Fundo de Tijolo?",
            options: [
                "O percentual do imóvel que está desocupado, sem render aluguel.",
                "O quanto de dinheiro o fundo tem no caixa guardado.",
                "O tempo de férias garantido dos trabalhadores daquele imóvel.",
                "A nota de crédito de risco que o fundo possui."
            ],
            correctAnswerIndex: 0,
            explanation: "Vacância física indica o espaço não alugado (vazio). Quanto menor a vacância, melhor para o fundo, pois significa que há mais espaços alugados gerando receita."
        }
    ],
    "3": [ // Trilha 3: Ações Globais
        {
            id: "3_1",
            text: "Ao comprar a fração mínima permitida de uma ação de uma empresa, você se torna:",
            options: [
                "O presidente da companhia.",
                "Sócio e acionista minoritário da empresa.",
                "Dono da marca perante a lei e patentes.",
                "Um prestador de serviços daquela empresa."
            ],
            correctAnswerIndex: 1,
            explanation: "Ação é a menor fração do capital social de uma empresa. Ao comprar, você vira sócio e passa a ter direito aos lucros (dividendos)."
        },
        {
            id: "3_2",
            text: "O que significa investir em Ações com foco em longo prazo?",
            options: [
                "Comprar pela manhã e vender no final da tarde se subir de valor (Day Trade).",
                "Comprar ações em momentos de alta e pânico da mídia.",
                "Buscar ser sócio de boas empresas e lucrar com o crescimento delas ao passar dos anos.",
                "Emprestar seu dinheiro pro governo."
            ],
            correctAnswerIndex: 2,
            explanation: "O sucesso no longo prazo (Buy and Hold) consiste em ignorar o sobe e desce diário do mercado e ganhar através do crescimento da empresa e acúmulo de dividendos ao longo dos anos."
        },
        {
            id: "3_3",
            text: "Qual o erro mais clássico de iniciantes na Bolsa (B3)?",
            options: [
                "Diversificar comprando mais de uma ação.",
                "Comprar na baixa com paciência.",
                "Comprar na euforia (na alta) e vender no pânico (na baixa).",
                "Estudar o fluxo de caixa da empresa."
            ],
            correctAnswerIndex: 2,
            explanation: "Pelas emoções, novatos costumam comprar quando a ação já subiu muito (euforia/noticiário) e vender com medo quando tudo cai (o inverso do lema: compre na baixa, venda na alta)."
        },
        {
            id: "3_4",
            text: "O que são ETFs (Exchange Traded Funds)?",
            options: [
                "Empréstimos Tarifados do Tesouro Federal.",
                "Estratégia Tributária Familiar para evitar impostos.",
                "Investimentos em Letras de Câmbio de Alto Risco.",
                "Fundos negociados em bolsa que buscam replicar o desempenho de um índice, como o Ibovespa ou S&P500."
            ],
            correctAnswerIndex: 3,
            explanation: "Os ETFs funcionam como 'cestas' de ações. Ao comprar um único ETF do Índice Bovespa (IBOV11, BOVA11), você está investindo em dezenas das maiores empresas do Brasil de uma vez só."
        },
        {
            id: "3_5",
            text: "Por que investir em ações globais (Ex: usar ETFs no S&P500) traz segurança ao portfólio?",
            options: [
                "Porque o governo americano garante a devolução do dinheiro nos EUA.",
                "Porque elas promovem a diversificação geográfica, atrelando patrimônio à moeda forte (Dólar) e empresas fortes mundialmente.",
                "Porque estrangeiros nunca perdem dinheiro na bolsa de outro país.",
                "Porque o real é mais forte e valoriza-se sempre em relação ao Dólar nas tendências longas."
            ],
            correctAnswerIndex: 1,
            explanation: "O Risco Brasil existe. Diversificar internacionalmente te blinda da desvalorização do Real frente ao Dólar e investe nas centenas de maiores empresas e maiores economias do globo."
        }
    ]
};
