import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Input, ListItem, Overlay, ButtonGroup, Icon } from 'react-native-elements';

export default function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', typeIndex: null, institution: '', permissionsIndex: null, email: '' });
  const [editUser, setEditUser] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const userTypeOptions = ['Docente', 'Estudante', 'Técnico Administrativo'];
  const userPermissionsOptions = ['Administrador', 'Coordenador de Pesquisa'];

  const validateFields = (user) => {
    const errors = {};
    if (!user.name) errors.name = 'Nome é obrigatório';
    if (user.typeIndex === null) errors.type = 'Tipo é obrigatório';
    if (!user.institution) errors.institution = 'Instituição é obrigatória';
    if (user.permissionsIndex === null) errors.permissions = 'Permissões são obrigatórias';
    if (!user.email) errors.email = 'Email é obrigatório';
    return errors;
  };

  const addUser = () => {
    const errors = validateFields(newUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUserObj = { 
      id: newId, 
      name: newUser.name, 
      type: userTypeOptions[newUser.typeIndex], 
      institution: newUser.institution, 
      permissions: userPermissionsOptions[newUser.permissionsIndex], 
      email: newUser.email 
    };
    setUsers([...users, newUserObj]);
    setNewUser({ name: '', typeIndex: null, institution: '', permissionsIndex: null, email: '' });
    setValidationErrors({});
  };

  const updateUser = () => {
    const errors = validateFields(editUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedUsers = users.map(user => user.id === editUser.id ? { ...editUser, type: userTypeOptions[editUser.typeIndex], permissions: userPermissionsOptions[editUser.permissionsIndex] } : user);
    setUsers(updatedUsers);
    setEditUser(null);
    setIsOverlayVisible(false);
    setValidationErrors({});
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>
        <Icon
          name="menu"
          size={28}
          onPress={() => console.log('Opções')}
        />
      </View>
      <Input
        placeholder="Nome"
        value={newUser.name}
        onChangeText={value => setNewUser({ ...newUser, name: value })}
        containerStyle={styles.inputContainer}
        errorMessage={validationErrors.name}
        leftIcon={<Icon name="person" size={24} color="gray" />}
      />
      <ButtonGroup
        onPress={index => setNewUser({ ...newUser, typeIndex: index })}
        selectedIndex={newUser.typeIndex}
        buttons={userTypeOptions}
        containerStyle={styles.buttonGroupContainer}
      />
      {validationErrors.type && <Text style={styles.errorText}>{validationErrors.type}</Text>}
      <Input
        placeholder="Instituição"
        value={newUser.institution}
        onChangeText={value => setNewUser({ ...newUser, institution: value })}
        containerStyle={styles.inputContainer}
        errorMessage={validationErrors.institution}
        leftIcon={<Icon name="school" size={24} color="gray" />}
      />
      <ButtonGroup
        onPress={index => setNewUser({ ...newUser, permissionsIndex: index })}
        selectedIndex={newUser.permissionsIndex}
        buttons={userPermissionsOptions}
        containerStyle={styles.buttonGroupContainer}
      />
      {validationErrors.permissions && <Text style={styles.errorText}>{validationErrors.permissions}</Text>}
      <Input
        placeholder="Email"
        value={newUser.email}
        onChangeText={value => setNewUser({ ...newUser, email: value })}
        containerStyle={styles.inputContainer}
        errorMessage={validationErrors.email}
        leftIcon={<Icon name="email" size={24} color="gray" />}
      />
      <Button
        title="Adicionar Usuário"
        onPress={addUser}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.addButton}
      />

      <ScrollView style={styles.listContainer}>
        {users.map(user => (
          <ListItem key={user.id} bottomDivider containerStyle={styles.listItemContainer}>
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
              <ListItem.Subtitle>{user.type}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.institution}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.permissions}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
              icon={<Icon name="edit" size={20} color="blue" />}
              onPress={() => { 
                setEditUser({ ...user, typeIndex: userTypeOptions.indexOf(user.type), permissionsIndex: userPermissionsOptions.indexOf(user.permissions) }); 
                setIsOverlayVisible(true); 
              }}
              buttonStyle={styles.editButton}
              type="clear"
            />
            <Button
              icon={<Icon name="delete" size={20} color="red" />}
              onPress={() => deleteUser(user.id)}
              buttonStyle={styles.deleteButton}
              type="clear"
            />
          </ListItem>
        ))}
      </ScrollView>

      <Overlay isVisible={isOverlayVisible} onBackdropPress={() => setIsOverlayVisible(false)}>
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Editar Usuário</Text>
          <Input
            placeholder="Nome"
            value={editUser?.name}
            onChangeText={value => setEditUser({ ...editUser, name: value })}
            containerStyle={styles.inputContainer}
            errorMessage={validationErrors.name}
            leftIcon={<Icon name="person" size={24} color="gray" />}
          />
          <ButtonGroup
            onPress={index => setEditUser({ ...editUser, typeIndex: index })}
            selectedIndex={editUser?.typeIndex}
            buttons={userTypeOptions}
            containerStyle={styles.buttonGroupContainer}
          />
          {validationErrors.type && <Text style={styles.errorText}>{validationErrors.type}</Text>}
          <Input
            placeholder="Instituição"
            value={editUser?.institution}
            onChangeText={value => setEditUser({ ...editUser, institution: value })}
            containerStyle={styles.inputContainer}
            errorMessage={validationErrors.institution}
            leftIcon={<Icon name="school" size={24} color="gray" />}
          />
          <ButtonGroup
            onPress={index => setEditUser({ ...editUser, permissionsIndex: index })}
            selectedIndex={editUser?.permissionsIndex}
            buttons={userPermissionsOptions}
            containerStyle={styles.buttonGroupContainer}
          />
          {validationErrors.permissions && <Text style={styles.errorText}>{validationErrors.permissions}</Text>}
          <Input
            placeholder="Email"
            value={editUser?.email}
            onChangeText={value => setEditUser({ ...editUser, email: value })}
            containerStyle={styles.inputContainer}
            errorMessage={validationErrors.email}
            leftIcon={<Icon name="email" size={24} color="gray" />}
          />
          <Button
            title="Salvar"
            onPress={updateUser}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.addButton}
          />
        </View>
      </Overlay>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004080',
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  buttonGroupContainer: {
    marginBottom: 10,
    width: '100%',
    borderColor: '#004080',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#004080',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  listContainer: {
    width: '100%',
    marginTop: 20,
  },
  listItemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  editButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  overlay: {
    padding: 20,
    width: '90%',
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#004080',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
