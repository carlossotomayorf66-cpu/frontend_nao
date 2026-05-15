import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/index';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useClientStore, Client } from '../store/clientStore';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ClientFormScreen = ({ route, navigation }: any) => {
  const clientToEdit = route.params?.client as Client;
  const { addClient, updateClient } = useClientStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Client>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (clientToEdit) {
      setForm(clientToEdit);
    }
  }, [clientToEdit]);

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      Alert.alert('Error', 'El nombre y apellido son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (clientToEdit?.id) {
        await updateClient(clientToEdit.id, form);
        Alert.alert('Éxito', 'Cliente actualizado correctamente');
      } else {
        await addClient(form);
        Alert.alert('Éxito', 'Cliente creado correctamente');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>{clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput
            label="Nombre"
            placeholder="Ej: Juan"
            value={form.first_name}
            onChangeText={(text) => setForm({ ...form, first_name: text })}
          />
          <CustomInput
            label="Apellido"
            placeholder="Ej: Pérez"
            value={form.last_name}
            onChangeText={(text) => setForm({ ...form, last_name: text })}
          />
          <CustomInput
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={form.email || ''}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
          />
          <CustomInput
            label="Teléfono"
            placeholder="Ej: 0991234567"
            value={form.phone || ''}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="Dirección"
            placeholder="Ej: Calle Principal 123"
            value={form.address || ''}
            onChangeText={(text) => setForm({ ...form, address: text })}
          />

          <View style={styles.spacer} />

          <CustomButton 
            title={clientToEdit ? "Actualizar" : "Guardar Cliente"} 
            onPress={handleSave}
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  spacer: {
    height: theme.spacing.lg,
  },
});
