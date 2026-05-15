import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/index';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useProductStore, Product } from '../store/productStore';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ProductFormScreen = ({ route, navigation }: any) => {
  const productToEdit = route.params?.product as Product;
  const { addProduct, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image_url: '',
  });

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit);
    }
  }, [productToEdit]);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      Alert.alert('Error', 'Nombre, precio y categoría son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (productToEdit?.id) {
        await updateProduct(productToEdit.id, form);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        await addProduct(form);
        Alert.alert('Éxito', 'Producto creado correctamente');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
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
        <Text style={styles.title}>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput
            label="Nombre del Producto"
            placeholder="Ej: Laptop Gamer"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <CustomInput
            label="Categoría"
            placeholder="Ej: Electrónica"
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
          />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomInput
                label="Precio ($)"
                placeholder="0.00"
                value={form.price.toString()}
                onChangeText={(text) => setForm({ ...form, price: parseFloat(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomInput
                label="Stock"
                placeholder="0"
                value={form.stock.toString()}
                onChangeText={(text) => setForm({ ...form, stock: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
          </View>
          <CustomInput
            label="Descripción"
            placeholder="Breve descripción del producto"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
          />
          <CustomInput
            label="URL de Imagen"
            placeholder="https://..."
            value={form.image_url || ''}
            onChangeText={(text) => setForm({ ...form, image_url: text })}
          />

          <View style={styles.spacer} />

          <CustomButton 
            title={productToEdit ? "Actualizar" : "Guardar Producto"} 
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacer: {
    height: theme.spacing.lg,
  },
});
