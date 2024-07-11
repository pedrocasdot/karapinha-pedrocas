// MyDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    border: '1px solid black',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
});

const MyDocument = ({ bookings, user }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Fatura de Agendamentos</Text>
      <Text>Nome do Cliente: {user.nomeCompleto}</Text>
      <Text>Email: {user.email}</Text>
      <Text style={styles.section}>Data: {new Date().toLocaleDateString()}</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '20%' }]}>Data</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Hora</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Serviço</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Profissional</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Preço</Text>
        </View>
        {bookings.map((booking, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '20%' }]}>{booking.date}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{booking.time}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{booking.service}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{booking.professional}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>KZ {booking.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default MyDocument;
