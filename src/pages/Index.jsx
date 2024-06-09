import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Box, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileUpload, FaFileAlt } from "react-icons/fa";

const clientsData = [
  {
    id: 1,
    name: "Client A",
    sites: [
      {
        id: 1,
        address: "123 Main St",
        roofType: "Flat",
        refurbishmentDate: "2022-01-01",
        certificate: null,
      },
      {
        id: 2,
        address: "456 Elm St",
        roofType: "Gabled",
        refurbishmentDate: "2021-06-15",
        certificate: null,
      },
    ],
  },
  {
    id: 2,
    name: "Client B",
    sites: [
      {
        id: 3,
        address: "789 Oak St",
        roofType: "Hip",
        refurbishmentDate: "2020-11-20",
        certificate: null,
      },
    ],
  },
];

const ClientList = ({ clients, onSelectClient }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Client Name</Th>
        <Th>Actions</Th>
      </Tr>
    </Thead>
    <Tbody>
      {clients.map((client) => (
        <Tr key={client.id}>
          <Td>{client.name}</Td>
          <Td>
            <Button onClick={() => onSelectClient(client)}>View Sites</Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

const SiteDetails = ({ client, onUploadCertificate }) => (
  <VStack spacing={4} align="stretch">
    {client.sites.map((site) => (
      <Box key={site.id} p={4} borderWidth="1px" borderRadius="lg">
        <Text>Address: {site.address}</Text>
        <Text>Roof Type: {site.roofType}</Text>
        <Text>Refurbishment Date: {site.refurbishmentDate}</Text>
        {site.certificate ? (
          <Box>
            <Text>Certificate: {site.certificate.name}</Text>
            <Button leftIcon={<FaFileAlt />}>View Certificate</Button>
          </Box>
        ) : (
          <Button leftIcon={<FaFileUpload />} onClick={() => onUploadCertificate(client.id, site.id)}>
            Upload Certificate
          </Button>
        )}
      </Box>
    ))}
  </VStack>
);

const Dashboard = () => {
  const [clients, setClients] = useState(clientsData);
  const [selectedClient, setSelectedClient] = useState(null);
  const toast = useToast();

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleUploadCertificate = (clientId, siteId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  sites: client.sites.map((site) => (site.id === siteId ? { ...site, certificate: file } : site)),
                }
              : client,
          ),
        );
        toast({
          title: "Certificate uploaded.",
          description: `Certificate for site ${siteId} has been uploaded.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fileInput.click();
  };

  return (
    <Container maxW="container.xl" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Dashboard
        </Text>
        {selectedClient ? (
          <Box>
            <Button onClick={() => setSelectedClient(null)}>Back to Clients</Button>
            <SiteDetails client={selectedClient} onUploadCertificate={handleUploadCertificate} />
          </Box>
        ) : (
          <ClientList clients={clients} onSelectClient={handleSelectClient} />
        )}
      </VStack>
    </Container>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;
