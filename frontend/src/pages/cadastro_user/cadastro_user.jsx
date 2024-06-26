import React, { useState } from 'react';
import { Link , useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import { IMaskInput } from "react-imask";




import Menu_principal from "../../components/menu_principal/menu_principal";
import campoPreencher from "../../components/formularios/input";
import CadastroSucesso from '../../components/formularios/popup-sucess';
import UserServices from '../../Services/UserService';






const validationSchema = Yup.object().shape({
    nome: Yup.string().required("* Campo obrigatório!")
    .matches(/^[a-zA-Z- ]*$/, "* É permitido somente letras e hífen!"),
    email: Yup.string().email("* Insira um email válido!").required("* Campo obrigatório!")
    .matches(/^[a-z.@0-9]*$/, "* Insira um e-mail válido!"),
    termos: Yup.boolean().isTrue("* É necessário aceitar os termos de condições!"),
    senha: Yup.string().required("* Campo obrigatório!").min(8, "* A senha deve conter no mínimo 8 caracteres")
    .matches(/[a-z]/,"* A senha deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/,"* A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/,"* A senha deve conter pelo menos um número")
    .matches(/[$*&@#()%@!-]/,"* A senha deve conter pelo menos um caracter especial (ex: -, #, *, &)")
    .max(16, "* A senha deve conter no máximo 16 caracteres"),
    telefone: Yup.string().required("* Campo obrigatório!").min(15, "* Insira um telefone válido!"),
    cpf: Yup.string().required("* Campo obrigatório!").min(14, "* Insira um cpf válido!"),
    dataNasc: Yup.date()
    .required("* Campo obrigatório!"),
    sexo: Yup.string().required("* Campo obrigatório!"),
    uf: Yup.string().required("* Campo obrigatório!")
    .matches(/^[a-zA-Z- ]*$/, "* É permitido somente letras e hífen!"),
    cidade: Yup.string().required("* Campo obrigatório!")
    .matches(/^[a-zA-Z- ]*$/, "* É permitido somente letras e hífen!"),
    bairro: Yup.string().required("* Campo obrigatório!")
    .matches(/^[a-zA-Z- ]*$/, "* É permitido somente letras e hífen!"),
    rua:Yup.string().required("* Campo obrigatório!"),
    cep: Yup.string().required("* Campo obrigatório!").min(9, "* Insira um cep válido!"),
    numero: Yup.string().required("* Campo obrigatório!"), 
    confirmSenha: Yup.string().oneOf([Yup.ref("senha"), null], "* As senhas devem corresponder!")
    .required("* Confirmação de senha é obrigatório!"), 
})

const userServices = new UserServices();


export default function Cadastro_user() {

    // botão mostrar senha
    const [showPass, setShowPass] = useState(false);
    const [showPass1, setShowPass1] = useState(false);
    const [statusPass1, setStatusPass1] = useState("password")
    const [statusPass, setStatusPass] = useState("password")
    const [fileSvg, setFileSvg] = useState("src/assets/eye-pass-show.svg")
    const [fileSvg1, setFileSvg1] = useState("src/assets/eye-pass-show.svg")

    function onClickButton(){
        if (showPass) {
            setShowPass(false);
            setStatusPass("password")
            setFileSvg("src/assets/eye-pass-show.svg")
        }
        else {
            setShowPass(true);
            setStatusPass("text")
            setFileSvg("src/assets/eye-pass-unshow.svg")
        }
    }
    function onClickButton1(){
        if (showPass1) {
            setShowPass1(false);
            setStatusPass1("password")
            setFileSvg1("src/assets/eye-pass-show.svg")
        }
        else {
            setShowPass1(true);
            setStatusPass1("text")
            setFileSvg1("src/assets/eye-pass-unshow.svg")
        }
    }

    //mostrar mensagem na tela de cadastro com sucesso
    const [submitted, setSubmitted] = useState(false);
    const [submittedError, setSubmittedError] =useState({hasError: false, type: ""});

    function onClickSubmitted (){
        setSubmitted(false);
        setSubmittedError(false);
    }

    //adicionar usuario ao banco de dados
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try {
            const response = await userServices.registerUser(values);


            if (response.existe) {
                setSubmittedError({hasError: true, type: response.existe})
                setTimeout(() => {
                    setSubmittedError({hasError: false, type: ""}) 
                }, 10000);
            } else if (response.redirect) {
                setSubmitted(true)
                setTimeout(() => {
                    navigate(response.redirect)
                }, 5000);
                
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    
    

    //calcular data para o calendário
    const date = new Date();
    const currentYear = date.getFullYear();
    const maxYear = currentYear - 14 +"-12-31";
    const minYear = currentYear - 130 +"-01-01";

    return (
        <div className="">
            <div className=" ml-6 mt-7">
                <Link to="/login">
                    <svg className=" fill-primaryColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
                </Link>
            </div>
            <div className="  flex justify-center items-center mt-5">
                
                <div className=" flex flex-col items-center justify-center w-80 mb-32 px-5 rounded-xl border-2 border-primaryColor shadow-2xl">
                    <h1 className=" font-extrabold text-4xl text-primaryColor mt-6">Cadastre seu usuário</h1>
                    <div className="flex flex-col  mt-6 h-full w-full mx-3">
                        <Formik 
                        initialValues={{nome : "", email : "", senha: "", confirmSenha: "", telefone: "", cpf : "", dataNasc : "", sexo: "", 
                        cep: "", uf: "", cidade : "", rua : "", numero: "", bairro: "", termos: false }}
                        onSubmit={values => {handleSubmit(values);}}
                        validationSchema={validationSchema}
                        >
                            {({handleSubmit}) => (
                                <Form onSubmit={handleSubmit}>
                                    {campoPreencher("Nome Completo:","Insira seu nome...","nome","text")}
                                    {campoPreencher("E-mail: ","Insira seu e-mail...","email","email")}
                                    <div className='relative'>
                                        {campoPreencher("Senha: ", "Insira sua senha...", "senha", statusPass)}
                                        <button className='absolute right-2 top-[35px]' type="button" onClick={onClickButton} name='' ><img src={fileSvg} alt="Mostrar Senha" /></button>
                                    </div>
                                    <div className='relative'>
                                        {campoPreencher("Confirme sua senha: ", "Repita sua senha...", "confirmSenha",statusPass1)}
                                        <button className='absolute right-2 top-[35px]' type="button" onClick={onClickButton1} name='' ><img src={fileSvg1} alt="Mostrar Senha" /></button>
                                    </div>
                                    
                                    <div className=" mb-3">
                                        <h1 className=" text-primaryColor font-bold">Número de celular: </h1>
                                        <Field name="telefone" type="text">
                                        {
                                            ({field}) => (
                                            <IMaskInput {...field}
                                            name="telefone"
                                            mask="(00) 00000-0000"
                                            placeholder='Insira seu celular...'
                                            className=" border-primaryColor border-2 rounded-md w-full h-[42px] pl-2"
                                            />
                                        )}
                                        </Field>

                                        <ErrorMessage name='telefone' component="div" className='error text-red-600 text-sm ml-3'/>
                                    </div>
                                    
                                    <div className=" mb-3">
                                        <h1 className=" text-primaryColor font-bold">Insira seu CPF:</h1>
                                        <Field name="cpf">{({field}) => (
                                            <IMaskInput {...field}
                                            name="cpf"
                                            mask="000.000.000-00"
                                            placeholder='Insira seu CPF...'
                                            className=" border-primaryColor border-2 rounded-md w-full h-[42px] pl-2"
                                            />
                                        )}</Field>
                                        <ErrorMessage name='cpf' component="div" className='error text-red-600 text-sm ml-3'/>
                                    </div>
                                    
                                    <div className='flex justify-between mb-3'>
                                        <div className='w-[80%]'>
                                            <h1 className=' font-bold'>Data de Nascimento: </h1>
                                            <Field type="date" name="dataNasc" max={maxYear} min={minYear} className="pl-2 w-11/12 h-[42px] border-primaryColor border-2 rounded-md"/>
                                            <ErrorMessage name='dataNasc' component="div" className='error text-red-600 text-sm ml-3'/>
                                        </div>
                                        <div className='overflow-hidden w-[47%]'>
                                            <h1 className='block font-bold text-primaryColor'>Sexo: </h1>
                                            <Field as="select" name="sexo" className=" h-[42px] border-primaryColor border-2 rounded-md">
                                                <option value="">Selecione</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                            </Field>
                                            <div className='overflow-scroll w-ful h-5 text-nowrap no-scrollbar'>
                                                <ErrorMessage name='sexo' component="div" className='error text-red-600 text-sm'/>
                                            </div>     
                                        </div>
                                    </div>

                                    <div className=' mb-3 mt-7 py-1 text-center bg-gradient-to-r from-lineColor from-10% via-zinc-300 via-50% to-lineColor to-90% rounded-md'>
                                        <span className='font-extrabold text-lg'>Endereço</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <div className='w-37'>
                                            <h1 className=" text-primaryColor font-bold">Insira seu CEP:</h1>
                                            <Field name="cep">{({field}) => (
                                                <IMaskInput {...field}
                                                name="cep"
                                                mask="00000-000"
                                                placeholder='Insira seu CEP...'
                                                className=" border-primaryColor border-2 rounded-md w-full h-[42px] pl-2"
                                                />
                                            )}</Field>
                                            <ErrorMessage name='cep' component="div" className='error text-red-600 text-sm ml-3'/>
                                        </div>
                                        <div className='w-28 ml-4 text-nowrap'>
                                            {campoPreencher("Número: ", "Insira o número...","numero")}
                                        </div>
                                    </div>

                                    {campoPreencher("Estado: ","Insira seu estado...", "uf", "text")}
                                    {campoPreencher("Cidade: ", "Insira sua cidade...","cidade","text")}
                                    {campoPreencher("Bairro: ","Insira seu bairro...","bairro","text")}
                                    {campoPreencher("Rua: ", "Insira sua rua...","rua")}

                                    <div className="h-3 "></div>

                                    <div className='mb-4'>
                                        <Field type='checkbox' name="termos" id="termos"className="mx-2"/>
                                        <label htmlFor='termos'>
                                            Aceito os
                                            <Link to="/termos_user">
                                                <span className='ml-1 text-linkColor underline visited:text-blue-950'>Termos de Condições</span>
                                            </Link>
                                        </label>
                                        <ErrorMessage name='termos' component="div" className='error text-red-600 text-sm ml-3'/>
                                    </div>
                                    <div className='flex justify-center mb-4'>
                                        <button id='submit' type='submit' className=" h-[42px] w-36 bg-secundaryColor rounded-xl active:bg-primaryColor active:text-secundaryColor">Enviar</button>
                                    </div>
                                    {submitted && <CadastroSucesso />
                                    }
                                    {submittedError.hasError &&
                                    <div>
                                        <div className="fixed flex justify-between px-2 pt-[6px]  w-[80%] h-[40px] bg-red-400 rounded-md border-red-800 border-2 opacity-[0.9] left-1/2 top-[8%] translate-x-[-50%] translate-y-[-50%]">
                                            <span className='text-white text-center'>Já existe uma conta com esse <span className='font-bold'>{submittedError.type} !</span></span>
                                            <span onClick={onClickSubmitted} className='text-white text-center font-bold ml-0'>X</span>
                                        </div>
                                    </div>
                                    }
                                </Form>

                            )}
                        </Formik>

                    </div>
                </div>
            </div>
            <Menu_principal />
        </div>
        
    )
}