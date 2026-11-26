
// ======================================
// CLOSET DA LUH
// JAVASCRIPT PRINCIPAL
// ======================================


// ======================================
// MENU PARA CELULAR
// ======================================

const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");

if (menuButton && menu) {

    menuButton.addEventListener("click", () => {

        const aberto = menu.classList.toggle("ativo");

        menuButton.setAttribute("aria-expanded", String(aberto));

    });

    menu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            menu.classList.remove("ativo");

            menuButton.setAttribute("aria-expanded", "false");

        });

    });

}


// ======================================
// CARREGAR SACOLA
// ======================================

let sacola = [];

try {

    const dadosSalvos = JSON.parse(
        localStorage.getItem("sacola") || "[]"
    );

    sacola = Array.isArray(dadosSalvos)
        ? dadosSalvos.filter(produto =>
            produto &&
            typeof produto.nome === "string" &&
            Number.isFinite(Number(produto.preco)) &&
            Number(produto.preco) > 0
        ).map(produto => ({
            nome: produto.nome,
            preco: Number(produto.preco),
            imagem: produto.imagem || "",
            quantidade: Math.max(
                1,
                Math.floor(Number(produto.quantidade) || 1)
            )
        }))
        : [];

} catch (erro) {

    console.error("Erro ao carregar a sacola:", erro);

    sacola = [];

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

        atualizarContador();

        return true;

    } catch (erro) {

        console.error("Erro ao salvar a sacola:", erro);

        alert("Não foi possível salvar sua sacola neste navegador.");

        return false;

    }

}


// ======================================
// ATUALIZAR CONTADOR DA SACOLA
// ======================================

function atualizarContador() {

    const contador = document.getElementById("contador-sacola");

    if (!contador) return;

    const quantidadeTotal = sacola.reduce(
        (total, produto) => {

            const quantidade = Math.max(
                1,
                Number(produto.quantidade) || 1
            );

            return total + quantidade;

        },
        0
    );

    contador.textContent = quantidadeTotal;

}


// ======================================
// CONVERTER PREÇO
// ======================================

function converterPreco(texto) {

    let valor = String(texto)
        .replace(/\s/g, "")
        .replace(/R\$/gi, "")
        .replace(/[^\d.,]/g, "");

    // Formato brasileiro: 1.299,90
    if (valor.includes(",")) {

        valor = valor
            .replace(/\./g, "")
            .replace(",", ".");

    }

    return Number(valor);

}


// ======================================
// ADICIONAR PRODUTO À SACOLA
// ======================================

function adicionarProduto(botao) {

    const produto = botao.closest(".produto");

    if (!produto) {

        alert("Não foi possível encontrar o produto.");

        return;

    }

    const nomeElemento = produto.querySelector("h3");
    const precoElemento = produto.querySelector(".preco");
    const imagemElemento = produto.querySelector("img");

    const nome = nomeElemento?.textContent.trim();

    const preco = converterPreco(
        precoElemento?.textContent || ""
    );

    const imagem = imagemElemento?.src || "";

    if (
        !nome ||
        !Number.isFinite(preco) ||
        preco <= 0
    ) {

        alert("Confira o nome e o preço deste produto.");

        return;

    }


    // VERIFICAR SE O PRODUTO JÁ EXISTE NA SACOLA

    const produtoExistente = sacola.find(item =>
        item.nome === nome &&
        Number(item.preco) === preco &&
        item.imagem === imagem
    );


    if (produtoExistente) {

        produtoExistente.quantidade =
            (Number(produtoExistente.quantidade) || 1) + 1;

    } else {

        sacola.push({

            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1

        });

    }


    // SALVAR E INFORMAR O RESULTADO

    if (salvarSacola()) {

        alert(nome + " foi adicionado à sua sacola!");

    }

}


// ======================================
// ATIVAR BOTÕES DE ADICIONAR
// ======================================

document.querySelectorAll(".btn-adicionar").forEach(botao => {

    botao.addEventListener("click", () => {

        adicionarProduto(botao);

    });

});


// ======================================
// ANO AUTOMÁTICO NO RODAPÉ
// ======================================

const ano = document.getElementById("ano");

if (ano) {

    ano.textContent = new Date().getFullYear();

}


// ======================================
// INICIALIZAR CONTADOR
// ======================================

atualizarContador();
