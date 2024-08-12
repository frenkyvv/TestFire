import React, { useState, useEffect, useCallback } from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import Seo from "../components/layout/seo"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import styled from "styled-components"
import "bootstrap/dist/css/bootstrap.css"
import { FirebaseContext } from '../utils/firebase';
import { getFirestore } from "../utils/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { FirebaseProvider } from '../utils/firebase';





function SecondPage() {

  const fstore = React.useContext(FirebaseContext);
  const [db, setDb] = useState(null);
  const [jugadores, setJugadores] = useState([])
  const [nombre, setNombre] = useState('')
  const [saldo, setSaldo] = useState(0)

  const obtenerJugadores = useCallback(async (fstore) => {
    console.log("obtenerJugadores")
    try {
      const db = getFirestore(fstore);
      const jugadoresRef = collection(db, "jugadores")
      const jugadoresDocs = await getDocs(jugadoresRef)
      const jugadoresData = jugadoresDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("Jugadores obtenidos de la base de datos:", jugadoresData)
      return jugadoresData
    } catch (error) {
      console.error(error)
    }
  }, []);

  const handleObtenerJugadores = useCallback(async () => {
    console.log("handleObtenerJugadores")
    const jugadoresData = await obtenerJugadores(fstore)
    console.log("Datos obtenidos:", jugadoresData)
    setJugadores(jugadoresData)
  }, [fstore]);

  const handleAgregarJugador = async () => {
    console.log("handleAgregarJugador")
    if (!db) return;
    try {
      const jugadoresRef = collection(db, "jugadores")
      await addDoc(jugadoresRef, { 
        nombre: nombre, 
        saldo: saldo 
      })
      console.log("Documento agregado")
      handleObtenerJugadores()
      console.log(nombre)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (fstore) {
      setDb(getFirestore(fstore));
      if (db) {
        handleObtenerJugadores();
      }
    }
  }, [fstore, db]);

  return (
    <FirebaseProvider>
    <Layout>
      <Seo title="Page two" />
      <Container>
      <FormContainer>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Nombre del jugador</Form.Label>
        <Form.Control type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Saldo</Form.Label>
        <Form.Control type="number" placeholder="saldo" value={saldo} onChange={(e) => setSaldo(e.target.value)} />
      </Form.Group>
      <Button variant="primary" onClick={handleAgregarJugador}>
        Go
      </Button>
      <ul>
        {jugadores.map(jugador => (
          <li key={jugador.id}>{jugador.nombre}</li>
        ))}
      </ul>
    </FormContainer>
      <Link to="/">Go back to the homepage</Link>
      </Container>
    </Layout>
    </FirebaseProvider>
  )
}

export default SecondPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`
