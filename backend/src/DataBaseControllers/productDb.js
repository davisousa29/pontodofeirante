const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cuid = require("cuid");

async function createProduct(dados){
    const lojaID = dados.id;
    try {
        const findItem = await prisma.produto.findUnique({
            where:{
                nomeProduto: dados.nomeProduto,
                lojaId: dados.id, 
            }
        })
        if (findItem) {
            const existCor = await prisma.corProduto.findFirst({
                    where:{
                        produtoId : findItem.id, 
                        nomeCor: dados.nomeCor
                    }
            })

            if (!existCor) {
                const create_product_variant = await prisma.corProduto.create({
                    data : {
                        id: cuid(),
                        produtoId: findItem.id, 
                        nomeCor: dados.nomeCor,
                            tamanhos: {
                                create:{
                                    id: cuid(),
                                    nomeTamanho : dados.nomeTamanho,
                                    detalhesProduto: {
                                        create:{
                                            id: cuid(),
                                            preco: dados.preco,
                                            qtd : dados.qtd 
                                        }
                                    }
                                }
                            }
                    }
                })
                return {msg: "Adicionado nova cor"};
            }
            if (existCor) {
                const existTamanho = await prisma.tamanhoProduto.findFirst({
                    where:{
                        corId : existCor.id, 
                        nomeTamanho: dados.nomeTamanho
                    }
                })

                if (!existTamanho) {
                    const create_product_variant = await prisma.tamanhoProduto.create({
                        data:{
                            corId: existCor.id,
                            id: cuid(),
                            nomeTamanho : dados.nomeTamanho,
                            detalhesProduto: {
                                create:{
                                    id: cuid(),
                                    preco: dados.preco,
                                    qtd : dados.qtd 
                                }
                            }
                        } 
                    })
                    return {msg: "adicionado novo tamanho"};
                }
                if (existTamanho) {
                    const create_product_variant = await prisma.detalhesProduto.create({
                        data:{
                            tamanhoId: existTamanho.id,
                            id:cuid(),
                            preco: dados.preco,
                            qtd: dados.qtd
                        }
                    })
                    return {msg: "Alterado Detalhes do Produto!"}
                }
            }

        } else if (!findItem) {
            const nameProduct = await prisma.produto.findUnique({
                where: {
                    nomeProduto: dados.nomeProduto
                }
            })
            if (nameProduct) {
                return {msg : "Já existe um produto com esse nome!"}
            }
            const create_product = await prisma.produto.create({
                data: {
                        id:cuid(),
                        lojaId: lojaID,
                        nomeProduto: dados.nomeProduto,
                        categoria:dados.categoria,
                        imagem: dados.imagem,
                        descricao: dados.descricao,   
                        cores: {
                            create: {
                                id:cuid(),
                                nomeCor: dados.nomeCor,
                                tamanhos: {
                                    create:{
                                        id:cuid(),
                                        nomeTamanho : dados.nomeTamanho,
                                        detalhesProduto: {
                                            create:{
                                                id: cuid(),
                                                preco: dados.preco,
                                                qtd : dados.qtd 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            )
        }
            
    
    } catch(err){
        console.log(err)
    }
    
}



//procurar produto beta
async function searchProducts(){

    const product = await prisma.produto.findMany({
        include: {
            cores: {
              include: {
                tamanhos: {
                  include: {
                    detalhesProduto: true,
                  },
                },
              },
            },
          },
    })

    console.log(product)
    return product
}

module.exports = { createProduct, searchProducts}