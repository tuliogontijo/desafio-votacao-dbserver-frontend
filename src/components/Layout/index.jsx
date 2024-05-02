import { Descriptions, Divider, InputNumber, Space } from 'antd';
import { FloatButton, Form, Input } from 'antd';
import { SyncOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import logo from '../../assets/loader.gif';

import Card from '../Card/index';
import Modal from '../Modal/index';
import { useState, useEffect, useRef } from 'react';
import { format, addMinutes } from 'date-fns';
import localePtBr from 'date-fns/locale/pt-BR';

import { pautas as pautasMock, votos, resultado } from '../../Mock';
import Radio from 'antd/es/radio/radio';

const Layout = () => {
  const [pautas, setPautas] = useState([]);
  const [results, setResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [pautaSelected, setPautaSelected] = useState(null);
  const [isModalInsertPautaOpen, setIsModalInsertPautaOpen] = useState(false);
  const [isModalOpenSessionOpen, setIsModalOpenSessionOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const [isModalResultOpen, setIsModalResultOpen] = useState(false);


  const [formInclusaoPauta] = Form.useForm();
  const [formAbrirSessao] = Form.useForm();
  const [formVoto] = Form.useForm();
  const inputTitleRef = useRef();
  const inputDurationRef = useRef();
  const inputCPFRef = useRef();

  const getPautas = async () => {
    setIsLoading(true);
    // Consumir API
    setTimeout(() => {
      setPautas(pautasMock);
      setIsLoading(false);
    }, 1000);
  }

  const getResults = async () => {
    setIsLoadingResults(true);
    // Consumir API
    setTimeout(() => {
      setResults(resultado);
      setIsLoadingResults(false);
    }, 1000);
  }

  useEffect(() => {
    getPautas();
  }, [])

  // useEffect(() => {
  //   const bodyOverflow = isLoading ? "hidden" : "";
  //   document.body.style.overflow = bodyOverflow;
  // }, [isLoading])

  const handleRefresh = () => {
    getPautas();
  };

  const toggleModal = (modalName = null, pauta = null) => {

    setPautaSelected(pauta);

    switch (modalName) {
      case "IncluirPauta":
        setIsModalInsertPautaOpen(prevState => !prevState);
        break;
      case "AbrirSessao":
        setIsModalOpenSessionOpen(prevState => !prevState);
        break;
      case "RegistrarVoto":
        setIsModalVoteOpen(prevState => !prevState);
        break;
      case "VerResultado":
        setIsModalResultOpen(prevState => !prevState);
        getResults(pauta);
        break;
      default:
        setIsModalInsertPautaOpen(false);
        setIsModalOpenSessionOpen(false);
        setIsModalVoteOpen(false);
        setIsModalResultOpen(false);
        break
    }
  };

  const handleOkModalInsertPauta = async () => {
    try {
      await formInclusaoPauta.validateFields();
    }
    catch {
      inputTitleRef.current.focus()
      return;
    }

    const { title, description } = formInclusaoPauta.getFieldsValue();

    //consumir API
    pautas.push({
      id: pautas.length + 1,// Não irá na requisição
      title: title,
      description: description,
      sessionOpennigDateTime: null,// Não irá na requisição
      expirationDateTime: null,// Não irá na requisição
      createdAt: new Date(),// Não irá na requisição
      statusSession: "CRIADA"// Não irá na requisição
    })
    getPautas();
    toggleModal();
  }

  const handleOkModalOpenSession = () => {
    //consumir API
    const { duration } = formAbrirSessao.getFieldsValue();
    const now = new Date();
    const sessionOpennigDateTime = format(now, "Pp", { locale: localePtBr });
    const expirationDateTime = format(addMinutes(now, duration), "Pp", { locale: localePtBr });


    setPautas(pautas.map((pauta) => {
      if (pauta.id === pautaSelected.id)
        pauta = {
          ...pautaSelected,
          sessionOpennigDateTime,
          expirationDateTime,
          statusSession: "ABERTA" // Não irá na requisição
        }

      return pauta;
    }))

    toggleModal();
  }


  const handleOkModalVote = async () => {
    try {
      await formVoto.validateFields();

    }
    catch {
      inputCPFRef.current.focus();
      return;
    }

    const { cpf, voto } = formVoto.getFieldsValue();


    votos.push({
      id: votos.length + 1,
      cpf,
      voto,
      createdAt: new Date(),
      idPauta: pautaSelected.id,
    })

    console.log(votos)


    toggleModal();
  }

  const loadingStylesContainer = {
    fontSize: 80,
    textAlign: 'center',
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    overflow: "hidden",
    position: "sticky",
    maxWidth: 1200,
    zIndex: 2,
    marginBottom: "-100vh"
  }


  return (
    <>
      {/* Transformar em Componente: Loader */}
      {isLoading &&
        <div style={loadingStylesContainer}>
          <div style={{ display: "flex", backgroundColor: "#fff", padding: 24, borderRadius: 30, boxShadow: "4px 4px 16px", height: 80, widows: 80 }}>
            <img src={logo} />
          </div>
        </div >
      }

      <>
        {/* Transformar em Componente: List */}
        <Space Space
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
            padding: '16px',
            filter: isLoading ? "blur(8px)" : "",
            marginBottom: 200
          }}
        >{pautas.map(pauta =>
          <Card
            data={pauta}
            key={pauta.id}
            handleOpenSession={() => toggleModal("AbrirSessao", pauta)}
            HandleGetResult={() => toggleModal("VerResultado", pauta)}
            HandleVote={() => toggleModal("RegistrarVoto", pauta)}
          />
        )}
        </Space>

        {/* Transformar em Componente: FloatButtons */}
        {!isLoading &&
          <>
            <FloatButton
              icon={<SyncOutlined />}
              tooltip="Atualizar Pautas"
              shape="circle"
              onClick={handleRefresh}
              style={{
                right: 24,
                width: 56,
                height: 56,
              }}
            />
            <FloatButton
              icon={<PlusOutlined />}
              tooltip="Incluir Pauta"
              shape="circle"
              onClick={() => toggleModal("IncluirPauta")}
              style={{
                right: 24,
                bottom: 120,
                width: 56,
                height: 56
              }}
            />
          </>
        }
        {/* Tentar criar prop options */}
        < Modal
          open={isModalInsertPautaOpen}
          title="Incluir Pauta"
          handleOk={handleOkModalInsertPauta}
          handleCancel={toggleModal}
          handleAfterOpen={() => inputTitleRef.current.focus()}
        >
          {/* Criar um componente para cada Form */}
          <Divider />
          < Form
            name="formInclusaoPauta"
            form={formInclusaoPauta}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Título"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'É obrigatória a inserção de um título!',
                },
              ]}
            >
              <Input
                ref={inputTitleRef}
                onPressEnter={handleOkModalInsertPauta}
              />
            </Form.Item>

            <Form.Item
              label="Descrição"
              name="description"
            >
              <Input.TextArea
                onPressEnter={handleOkModalInsertPauta}
              />
            </Form.Item>
          </ Form>
          <Divider />
        </Modal >

        <Modal
          open={isModalOpenSessionOpen}
          title="Abrir Sessão"
          handleOk={handleOkModalOpenSession}
          handleCancel={toggleModal}
          handleAfterOpen={() => inputDurationRef.current.focus()}
        >
          < Form
            name="formAbrirSessao"
            form={formAbrirSessao}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{ verticalAlign: "middle" }}
            autoComplete="off"
          >
            <Divider />
            <div style={{ margin: "20px 0px 30px 0px" }}>
              <p>Pauta: <span style={{ fontWeight: 900 }}> {pautaSelected?.title}</span></p>
            </div>
            <Form.Item
              label="Duração"
              name="duration"
              initialValue={1}
              shouldUpdate={true}
            >

              <InputNumber
                ref={inputDurationRef}
                addonAfter={<p>minutos</p>}
                onPressEnter={handleOkModalOpenSession}
                min={1}
              />
            </Form.Item>
            <Divider />
          </ Form>
        </Modal>
        <Modal
          open={isModalVoteOpen}
          title="Registrar Voto"
          handleOk={handleOkModalVote}
          handleCancel={() => toggleModal("RegistrarVoto")}
          handleAfterOpen={() => inputCPFRef.current.focus()}
        >
          < Form
            name="formVoto"
            form={formVoto}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{ verticalAlign: "middle" }}
            autoComplete="off"
          >

            <Divider />
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[
                {
                  required: true,
                  message: 'É obrigatória a inserção de um CPF!',
                },
              ]}
            >
              <Input
                onPressEnter={handleOkModalVote}
                maxLength={11}
                //minLength={11}
                ref={inputCPFRef}
              />
            </Form.Item>

            <Form.Item
              label="Voto"
              name="voto"
              rules={[
                {
                  required: true,
                  message: 'É obrigatória a escolha de um voto!',
                },
              ]}
            >
              <Radio.Group onPressEnter={handleOkModalVote} >
                <Space direction="horizontal">
                  <Radio value={"Sim"}>Sim</Radio>
                  <Radio value={"Não"}>Não</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Divider />
          </Form>
        </Modal>
        <Modal
          open={isModalResultOpen}
          title="Ver Resultado"
          handleOk={toggleModal}
          handleCancel={() => toggleModal("VerResultado")}
        >
          <Divider />
          <p> Pauta: <span style={{ fontWeight: 900 }}> {pautaSelected?.title}</span></p>
          {isLoadingResults ?

            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 48
            }}>
              <LoadingOutlined spin />
            </div>

            : <><Descriptions bordered style={{ padding: 0 }} items={[
              {
                key: 'sim',
                label: 'Votos Sim:',
                children: <>{results.votesYes}</>,
              },
              {
                key: 'não',
                label: 'Votos Não',
                children: <>{results.votesNo}</>,
              }
            ]} />
              <p style={{
                textAlign: "center",
                fontSize: 24,
                backgroundColor: results.approved ? "#52C41A" : "#FF4D4F",
                color: "white",
                borderRadius: 8,
                margin: "20px 40px",
              }}>{results.approved ? "Pauta Aprovada!" : "Pauta Reprovada!"}</p>
            </>
          }
          <Divider />
        </Modal>
      </>
    </>
  )
}

export default Layout;
