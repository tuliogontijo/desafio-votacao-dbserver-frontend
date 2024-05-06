import {
  Descriptions,
  Divider,
  InputNumber,
  Space,
  FloatButton,
  Form,
  Input,
  Radio,
  message,
  Segmented,
  Affix,
} from 'antd';
import { SyncOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import loader from '../../assets/loader.gif';

import Card from '../Card/index';
import Modal from '../Modal/index';
import { useState, useEffect, useRef } from 'react';

import * as api from '../../service';
import { formatDate } from '../../utils';

const Layout = () => {
  const [pautas, setPautas] = useState(null);
  const [statusSelector, setStatusSelector] = useState('TODAS');
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
    await api
      .consultaPautas()
      .then((response) => {
        const dataToDisplay = response.data.map((pauta) => {
          return {
            ...pauta,
            sessionOpennigDateTime: formatDate(new Date(pauta.sessionOpennigDateTime)),
            expirationDateTime: formatDate(new Date(pauta.expirationDateTime)),
          };
        });
        setPautas(dataToDisplay);
      })
      .catch((error) => {
        notify('error', error?.response?.data?.message || 'Algo deu errado ao consultar as Pautas');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getResults = async (pauta, partial = false) => {
    setIsLoadingResults(!partial);
    let partialToReturn;

    await api
      .consultaResultado(pauta.id)
      .then((response) => {
        if (!partial) {
          setResults(response.data);
        }
        partialToReturn = response.data;
      })
      .catch((error) => {
        notify('error', error?.response?.data?.message || 'Algo deu errado ao consultar o resultado');
      })
      .finally(() => {
        setIsLoadingResults(false);
      });

    return partialToReturn;
  };

  useEffect(() => {
    getPautas();
  }, []);

  useEffect(() => {
    const bodyOverflow = isLoading ? 'hidden' : '';
    document.body.style.overflow = bodyOverflow;
  }, [isLoading]);

  const handleRefresh = () => {
    getPautas();
  };

  const toggleModal = (modalName = null, pauta = pautaSelected || null) => {
    setPautaSelected(pauta);

    switch (modalName) {
      case 'IncluirPauta':
        setIsModalInsertPautaOpen((prevState) => !prevState);
        break;
      case 'AbrirSessao':
        setIsModalOpenSessionOpen((prevState) => !prevState);
        break;
      case 'RegistrarVoto':
        setIsModalVoteOpen((prevState) => !prevState);
        break;
      case 'VerResultado':
        setIsModalResultOpen((prevState) => !prevState);
        getResults(pauta);
        break;
      default:
        setIsModalInsertPautaOpen(false);
        setIsModalOpenSessionOpen(false);
        setIsModalVoteOpen(false);
        setIsModalResultOpen(false);
        break;
    }
  };

  const handleOkModalInsertPauta = async () => {
    try {
      await formInclusaoPauta.validateFields();
    } catch {
      inputTitleRef.current.focus();
      return;
    }
    setIsLoading(true);
    toggleModal();

    const { title, description } = formInclusaoPauta.getFieldsValue();

    await api
      .criaPauta({ title, description })
      .then(() => {
        notify('success', 'Pauta inserida com sucesso!');
        getPautas();
      })
      .catch((error) => {
        notify('error', error?.response?.data?.message || 'Algo deu errado ao incluir a Pauta');
      })
      .finally(() => {
        setIsLoading(false);
        setStatusSelector('CRIADA');
      });
  };

  const handleOkModalVote = async () => {
    try {
      await formVoto.validateFields();
    } catch {
      inputCPFRef.current.focus();
      return;
    }
    setIsLoading(true);
    toggleModal();

    const { cpf, voto } = formVoto.getFieldsValue();

    await api
      .registraVoto(pautaSelected.id, { cpf, vote: voto })
      .then(() => {
        notify('success', 'Voto registrado com sucesso!');
        getPautas();
      })
      .catch((error) => {
        notify(
          'error',
          error?.response?.data?.message ||
            error?.response?.data?.errors.join('\n') ||
            'Algo deu errado ao registrar o voto',
        );
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOkModalOpenSession = async () => {
    toggleModal();
    setIsLoading(true);
    const { duration } = formAbrirSessao.getFieldsValue();

    await api
      .abreSessao(pautaSelected.id, { duration })
      .then(() => {
        notify('success', 'Sessão aberta com sucesso!');
        getPautas();
      })
      .catch((error) => {
        notify('error', error?.response?.data?.message || 'Algo deu errado ao abrir a Sessão');
      })
      .finally(() => {
        setIsLoading(false);
        setStatusSelector('ABERTA');
      });
  };

  const loadingStylesContainer = {
    fontSize: 80,
    textAlign: 'center',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    overflow: 'hidden',
    position: 'sticky',
    maxWidth: 1200,
    zIndex: 2,
    marginBottom: '-100vh',
  };

  const notify = (type, content) => {
    message.open({
      type,
      content,
      maxCount: 1,
    });
  };

  const segmentedOptions = [
    {
      label: <p>Todas</p>,
      value: 'TODAS',
    },
    {
      label: <p>Criadas</p>,
      value: 'CRIADA',
    },
    {
      label: <p>Abertas</p>,
      value: 'ABERTA',
    },
    {
      label: <p>Fechadas</p>,
      value: 'FECHADA',
    },
  ];

  return (
    <>
      {/* Transformar em Componente: Loader */}
      {isLoading && (
        <div style={loadingStylesContainer}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 30,
              boxShadow: '4px 4px 16px',
              height: 80,
              widows: 80,
            }}
          >
            <img src={loader} />
          </div>
        </div>
      )}
      <Affix>
        <Segmented
          options={segmentedOptions}
          onChange={(value) => setStatusSelector(value)}
          block={true}
          value={statusSelector}
          style={{ margin: '4px 16px ', padding: 16, fontSize: 16, opacity: 0.9 }}
        />
      </Affix>
      <>
        {/* Transformar em Componente: List */}
        <Space
          direction='vertical'
          size='middle'
          style={{
            display: 'flex',
            padding: '16px',
            filter: isLoading ? 'blur(8px)' : '',
            marginBottom: 200,
          }}
        >
          {pautas?.map((pauta) => {
            if (pauta?.statusSession === statusSelector || statusSelector === 'TODAS')
              return (
                <Card
                  pauta={pauta}
                  key={pauta.id}
                  handleOpenSession={() => toggleModal('AbrirSessao', pauta)}
                  handleGetResult={() => toggleModal('VerResultado', pauta)}
                  handleVote={() => toggleModal('RegistrarVoto', pauta)}
                  getPartialVotes={() => getResults(pauta, true)}
                />
              );
          })}
        </Space>

        {/* Transformar em Componente: FloatButtons */}
        {!isLoading && (
          <>
            <FloatButton
              icon={<SyncOutlined />}
              tooltip='Atualizar Pautas'
              shape='circle'
              onClick={handleRefresh}
              style={{
                right: 24,
                width: 56,
                height: 56,
              }}
            />
            <FloatButton
              icon={<PlusOutlined />}
              tooltip='Incluir Pauta'
              shape='circle'
              onClick={() => toggleModal('IncluirPauta')}
              style={{
                right: 24,
                bottom: 120,
                width: 56,
                height: 56,
              }}
            />
          </>
        )}
        {/* Tentar criar prop options */}
        <Modal
          open={isModalInsertPautaOpen}
          title='Incluir Pauta'
          handleOk={handleOkModalInsertPauta}
          handleCancel={toggleModal}
          handleAfterOpen={() => inputTitleRef.current.focus()}
        >
          {/* Criar um componente para cada Form */}
          <Divider />
          <Form
            name='formInclusaoPauta'
            form={formInclusaoPauta}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            autoComplete='off'
          >
            <Form.Item
              label='Título'
              name='title'
              rules={[
                {
                  required: true,
                  message: 'É obrigatória a inserção de um título!',
                },
              ]}
            >
              <Input ref={inputTitleRef} onPressEnter={handleOkModalInsertPauta} />
            </Form.Item>

            <Form.Item label='Descrição' name='description'>
              <Input.TextArea onPressEnter={handleOkModalInsertPauta} />
            </Form.Item>
          </Form>
          <Divider />
        </Modal>

        <Modal
          open={isModalOpenSessionOpen}
          title='Abrir Sessão'
          handleOk={handleOkModalOpenSession}
          handleCancel={toggleModal}
          handleAfterOpen={() => inputDurationRef.current.focus()}
        >
          <Form
            name='formAbrirSessao'
            form={formAbrirSessao}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{ verticalAlign: 'middle' }}
            autoComplete='off'
          >
            <Divider />
            <div style={{ margin: '20px 0px 30px 0px' }}>
              <p>
                Pauta: <span style={{ fontWeight: 900 }}> {pautaSelected?.title}</span>
              </p>
            </div>
            <Form.Item label='Duração' name='duration' initialValue={1} shouldUpdate={true}>
              <InputNumber
                ref={inputDurationRef}
                addonAfter={<p>minutos</p>}
                onPressEnter={handleOkModalOpenSession}
                min={1}
              />
            </Form.Item>
            <Divider />
          </Form>
        </Modal>
        <Modal
          open={isModalVoteOpen}
          title='Registrar Voto'
          handleOk={handleOkModalVote}
          handleCancel={toggleModal}
          handleAfterOpen={() => inputCPFRef.current.focus()}
        >
          <Form
            name='formVoto'
            form={formVoto}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{ verticalAlign: 'middle' }}
            autoComplete='off'
          >
            <Divider />
            <Form.Item
              label='CPF'
              name='cpf'
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
              label='Voto'
              name='voto'
              rules={[
                {
                  required: true,
                  message: 'É obrigatória a escolha de um voto!',
                },
              ]}
            >
              <Radio.Group onPressEnter={handleOkModalVote}>
                <Space direction='horizontal'>
                  <Radio value={'Sim'}>Sim</Radio>
                  <Radio value={'Não'}>Não</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Divider />
          </Form>
        </Modal>
        <Modal
          open={isModalResultOpen}
          title='Ver Resultado'
          handleOk={toggleModal}
          handleCancel={toggleModal}
          footer={(_, { OkBtn }) => <OkBtn />}
        >
          <Divider />
          <p>
            {' '}
            Pauta: <span style={{ fontWeight: 900 }}> {pautaSelected?.title}</span>
          </p>
          {isLoadingResults ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 48,
              }}
            >
              <LoadingOutlined spin />
            </div>
          ) : (
            <>
              <Descriptions
                bordered
                style={{ padding: 0 }}
                items={[
                  {
                    key: 'sim',
                    label: 'Votos Sim:',
                    children: <>{results.votesYes}</>,
                  },
                  {
                    key: 'não',
                    label: 'Votos Não',
                    children: <>{results.votesNo}</>,
                  },
                ]}
              />
              <p
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  backgroundColor: results.approved ? '#52C41A' : '#FF4D4F',
                  color: 'white',
                  borderRadius: 8,
                  margin: '20px 40px',
                }}
              >
                {results.approved ? 'Pauta Aprovada!' : 'Pauta Reprovada!'}
              </p>
            </>
          )}
          <Divider />
        </Modal>
      </>
    </>
  );
};

export default Layout;
