
(() => {

// ======================================
// CLOSET DA LUH
// JAVASCRIPT COMPLETO DA SACOLA
// ======================================

const telefoneLoja = "5521987918797";

let sacola = [];


// ======================================
// CARREGAR SACOLA
// ======================================

function carregarSacola() {

    try {

        const dados = JSON.parse(
            localStorage.getItem("sacola") || "[]"
        );

        if (!Array.isArray(dados)) {
            return [];
        }

        const produtosOrganizados = [];

        dados.forEach(produto => {

            if (
                !produto ||
                !produto.nome ||
                !Number.isFinite(Number(produto.preco)) ||
                Number(produto.preco) <= 0
            ) {
                return;
            }

            const nome = String(produto.nome);
            const preco = Number(produto.preco);
            const imagem = String(produto.imagem || "");

            const quantidade = Math.max(
                1,
                Math.floor(Number(produto.quantidade) || 1)
            );

            const existente = produtosOrganizados.find(item =>
                item.nome === nome &&
                item.preco === preco &&
                item.imagem === imagem
            );

            if (existente) {

                existente.quantidade += quantidade;

            } else {

                produtosOrganizados.push({
                    nome,
                    preco,
                    imagem,
                    quantidade
                });

            }

        });

        return produtosOrganizados;

    } catch (erro) {

        console.error("Erro ao carregar a sacola:", erro);

        return [];

    }

}

sacola = carregarSacola();


// ======================================
// FORMATAR PREÇOS
// ======================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ======================================
// SALVAR SACOLA
// ======================================

function salvarSacola() {

    try {

        localStorage.setItem(
            "sacola",
            JSON.stringify(sacola)
        );

        return true;

    } catch (erro) {

        console.error(
            "Não foi possível salvar a sacola:",
            erro
        );

        alert(
            "Não foi possível salvar sua sacola. Verifique o armazenamento do navegador."
        );

        return false;

    }

}


// ======================================
// CALCULAR QUANTIDADE
// ======================================

function calcularQuantidade() {

    return sacola.reduce(
        (total, produto) =>
            total + produto.quantidade,
        0
    );

}


// ======================================
// CALCULAR TOTAL
// ======================================

function calcularTotal() {

    return sacola.reduce(
        (total, produto) =>
            total + produto.preco * produto.quantidade,
        0
    );

}


// ======================================
// MOSTRAR PRODUTOS NA SACOLA
// ======================================

function mostrarSacola() {

    const lista = document.getElementById("lista-sacola");

    const quantidadeElemento =
        document.getElementById("quantidade-sacola");

    const totalElemento =
        document.getElementById("total-sacola");

    if (!lista) return;

    lista.innerHTML = "";

    if (sacola.length === 0) {

        const vazio = document.createElement("div");

        vazio.className = "sacola-vazia";

        const titulo = document.createElement("h2");
        titulo.textContent = "Sua sacola está vazia!";

        const texto = document.createElement("p");
        texto.textContent =
            "Que tal escolher algumas peças lindas?";

        const link = document.createElement("a");

        link.href = "index.html";
        link.className = "continuar-comprando";
        link.textContent = "Continuar comprando";

        vazio.append(titulo, texto, link);

        lista.appendChild(vazio);

        if (quantidadeElemento) {
            quantidadeElemento.textContent = "0";
        }

        if (totalElemento) {
            totalElemento.textContent = formatarPreco(0);
        }

        return;

    }


    sacola.forEach((produto, indice) => {

        const item = document.createElement("article");

        item.className = "item-sacola";


        // IMAGEM

        if (produto.imagem) {

            const imagem = document.createElement("img");

            imagem.className = "imagem-sacola";
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;
            imagem.loading = "lazy";

            imagem.onerror = () => {
                imagem.style.display = "none";
            };

            item.appendChild(imagem);

        } else {

            const imagemVazia = document.createElement("div");

            imagemVazia.className =
                "imagem-sacola imagem-sem-foto";

            imagemVazia.textContent = "Sem imagem";

            item.appendChild(imagemVazia);

        }


        // INFORMAÇÕES

        const informacoes = document.createElement("div");

        informacoes.className = "informacoes-sacola";


        const nome = document.createElement("h3");

        nome.textContent = produto.nome;


        const preco = document.createElement("p");

        preco.className = "preco-sacola";

        preco.textContent =
            formatarPreco(produto.preco) + " por unidade";


        // CONTROLES DE QUANTIDADE

        const controles = document.createElement("div");

        controles.className = "controles-quantidade";


        const diminuir = document.createElement("button");

        diminuir.type = "button";
        diminuir.textContent = "−";
        diminuir.dataset.acao = "diminuir";
        diminuir.dataset.indice = indice;

        diminuir.setAttribute(
            "aria-label",
            "Diminuir quantidade"
        );


        const quantidade = document.createElement("span");

        quantidade.textContent = produto.quantidade;


        const aumentar = document.createElement("button");

        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.dataset.acao = "aumentar";
        aumentar.dataset.indice = indice;

        aumentar.setAttribute(
            "aria-label",
            "Aumentar quantidade"
        );


        controles.append(
            diminuir,
            quantidade,
            aumentar
        );


        // SUBTOTAL

        const subtotal = document.createElement("strong");

        subtotal.className = "subtotal-sacola";

        subtotal.textContent =
            "Subtotal: " +
            formatarPreco(
                produto.preco * produto.quantidade
            );


        // REMOVER

        const remover = document.createElement("button");

        remover.type = "button";
        remover.className = "remover-produto";
        remover.textContent = "Remover produto";
        remover.dataset.acao = "remover";
        remover.dataset.indice = indice;


        informacoes.append(
            nome,
            preco,
            controles,
            subtotal,
            remover
        );

        item.appendChild(informacoes);

        lista.appendChild(item);

    });


    // ATUALIZAR RESUMO

    if (quantidadeElemento) {

        quantidadeElemento.textContent =
            calcularQuantidade();

    }

    if (totalElemento) {

        totalElemento.textContent =
            formatarPreco(calcularTotal());

    }

}


// ======================================
// AUMENTAR, DIMINUIR E REMOVER
// ======================================

document.addEventListener("click", function(event) {

    if (!(event.target instanceof Element)) return;

    const botao = event.target.closest("[data-acao]");

    if (!botao) return;

    const indice = Number(botao.dataset.indice);

    const acao = botao.dataset.acao;

    if (
        !Number.isInteger(indice) ||
        !sacola[indice]
    ) {
        return;
    }


    if (acao === "aumentar") {

        sacola[indice].quantidade += 1;

    }


    if (acao === "diminuir") {

        sacola[indice].quantidade -= 1;

        if (sacola[indice].quantidade <= 0) {

            sacola.splice(indice, 1);

        }

    }


    if (acao === "remover") {

        sacola.splice(indice, 1);

    }


    if (salvarSacola()) {

        mostrarSacola();

    }

});


// ======================================
// MOSTRAR OU ESCONDER ENDEREÇO
// ======================================

const opcoesRecebimento = document.querySelectorAll(
    'input[name="recebimento"]'
);

const campoEndereco =
    document.getElementById("campo-endereco");

const enderecoEntrega =
    document.getElementById("endereco-entrega");


function atualizarCampoEndereco() {

    const selecionado = document.querySelector(
        'input[name="recebimento"]:checked'
    );

    const entregaEmCasa =
        selecionado?.value === "motoboy";

    if (campoEndereco) {

        campoEndereco.hidden = !entregaEmCasa;

    }

    if (enderecoEntrega) {

        enderecoEntrega.required = entregaEmCasa;

        if (!entregaEmCasa) {

            enderecoEntrega.value = "";

        }

    }

}


opcoesRecebimento.forEach(opcao => {

    opcao.addEventListener(
        "change",
        atualizarCampoEndereco
    );

});

atualizarCampoEndereco();


// ======================================
// FINALIZAR PEDIDO PELO WHATSAPP
// ======================================

function finalizarCompra() {

    if (sacola.length === 0) {

        alert("Sua sacola está vazia!");

        return;

    }


    const recebimento = document.querySelector(
        'input[name="recebimento"]:checked'
    );

    const pagamento = document.querySelector(
        'input[name="pagamento"]:checked'
    );


    if (!recebimento) {

        alert("Escolha como deseja receber seu pedido.");

        return;

    }


    if (!pagamento) {

        alert("Escolha uma forma de pagamento.");

        return;

    }


    const endereco =
        enderecoEntrega?.value.trim() || "";


    if (
        recebimento.value === "motoboy" &&
        !endereco
    ) {

        alert("Informe o endereço para entrega.");

        enderecoEntrega?.focus();

        return;

    }


    if (!/^55\d{10,11}$/.test(telefoneLoja)) {

        alert("Confira o número de WhatsApp da loja.");

        return;

    }


    // MENSAGEM FEMININA E MINIMALISTA

    let mensagem =
        "Olá! ♡\n\n" +
        "Gostaria de fazer um pedido na *Closet da Luh*.\n\n" +
        "୨୧ *MEU PEDIDO*\n\n";


    sacola.forEach(produto => {

        mensagem +=
            `*${produto.nome}*\n` +
            `${produto.quantidade} unidade(s) · ${formatarPreco(produto.preco)}\n` +
            `Subtotal: ${formatarPreco(produto.preco * produto.quantidade)}\n\n`;

    });


    mensagem +=
        "♡ *TOTAL DO PEDIDO: " +
        formatarPreco(calcularTotal()) +
        "*\n\n";


    // RECEBIMENTO

    mensagem += "୨୧ *FORMA DE RECEBIMENTO*\n";


    if (recebimento.value === "motoboy") {

        mensagem +=
            "Entrega por motoboy\n" +
            `Endereço: ${endereco}\n` +
            "Valor da entrega a combinar.\n\n";

    } else {

        mensagem +=
            "Retirada na loja\n" +
            "Gostaria de combinar o endereço e horário da retirada.\n\n";

    }


    // PAGAMENTO

    mensagem +=
        "୨୧ *FORMA DE PAGAMENTO*\n" +
        pagamento.value +
        "\n\n";


    mensagem +=
        "Aguardo a confirmação do meu pedido.\n\n" +
        "Obrigada pela atenção! ♡\n" +
        "*Closet da Luh* 🌷";


    const link =
        `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagem)}`;


    window.open(
        link,
        "_blank",
        "noopener,noreferrer"
    );

}


// ======================================
// BOTÃO FINALIZAR
// ======================================

const botaoFinalizar =
    document.getElementById("finalizar-compra");

if (botaoFinalizar) {

    botaoFinalizar.addEventListener(
        "click",
        finalizarCompra
    );

}


// ======================================
// ANO AUTOMÁTICO
// ======================================

const ano = document.getElementById("ano");

if (ano) {

    ano.textContent = new Date().getFullYear();

}


// ======================================
// INICIAR SACOLA
// ======================================

mostrarSacola();

})();
