import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';


const Stack = createNativeStackNavigator();

const productos = [
  {
    id: '1',
    nombre: 'Tenis adidas',
    precio: 10.99,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqFXITYFR-zGyUHuJ4iqBZI1S6GWM0-T9dQ&s',
    reseñas: [5, 4, 4, 5],
  },
  {
    id: '2',
    nombre: 'Producto 2',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/150',
    reseñas: [3, 4, 5],
  },
  {
    id: '3',
    nombre: 'Producto 3',
    precio: 7.99,
    imagen: 'https://via.placeholder.com/150',
    reseñas: [5, 5, 5, 4],
  },
  {
    id: '4',
    nombre: 'Producto 4',
    precio: 12.49,
    imagen: 'https://via.placeholder.com/150',
    reseñas: [4, 4, 3],
  },
];

function HomeScreen({ navigation }) {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    Alert.alert('✅ Producto agregado', `${producto.nombre} ha sido agregado al carrito.`);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const promedioEstrellas = (reseñas) => {
    const total = reseñas.reduce((sum, r) => sum + r, 0);
    return Math.round(total / reseñas.length);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9f9f9' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuAbierto(!menuAbierto)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Mi Tienda</Text>
      </View>

      {/* Menú lateral */}
      {menuAbierto && (
        <View style={styles.menuLateral}>
          <View style={{ marginTop: 100 }}>
            <TouchableOpacity onPress={() => setMenuAbierto(false)}>
              <Text style={styles.menuItem}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setMenuAbierto(false);
              navigation.navigate('Carrito', { carrito, setCarrito });
            }}>
              <Text style={styles.menuItem}>🛒 Ir al carrito</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuAbierto(false)}>
              <Text style={styles.menuCerrar}>✖️ Cerrar menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={{ marginBottom: 60 }}>
        {/* Buscador */}
        <TextInput
          style={styles.input}
          placeholder="🔍 Buscar productos..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {/* Productos destacados */}
        <Text style={styles.subtitulo}>🔥 Productos destacados</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Detalle', { producto: item, agregarAlCarrito })}
              style={styles.destacadoCard}
            >
              <Image source={{ uri: item.imagen }} style={styles.imagenDestacada} />
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text>💲 {item.precio.toFixed(2)}</Text>
              <View style={styles.estrellas}>
                {Array(promedioEstrellas(item.reseñas))
                  .fill()
                  .map((_, i) => (
                    <Text key={i}>⭐</Text>
                  ))}
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Todos los productos */}
        <Text style={styles.subtitulo}>Todos los productos</Text>
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Detalle', { producto: item, agregarAlCarrito })}
              style={styles.card}
            >
              <Image source={{ uri: item.imagen }} style={styles.imagen} />
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text>💲 {item.precio.toFixed(2)}</Text>
              <View style={styles.estrellas}>
                {Array(promedioEstrellas(item.reseñas))
                  .fill()
                  .map((_, i) => (
                    <Text key={i}>⭐</Text>
                  ))}
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Botón flotante carrito */}
      <View style={styles.botonFijo}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Carrito', { carrito, setCarrito })}
          style={styles.botonIrCarrito}
        >
          <Text style={styles.textoBoton}>🛒 Ver carrito ({carrito.length})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CarritoScreen({ route, navigation }) {
  const { carrito, setCarrito } = route.params;

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
    Alert.alert('🗑️ Producto eliminado');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9f9f9' }]}>
      <Text style={styles.subtitulo}>🛒 Carrito</Text>
      <ScrollView style={{ marginBottom: 60 }}>
        {carrito.length === 0 ? (
          <Text style={{ textAlign: 'center' }}>El carrito está vacío.</Text>
        ) : (
          carrito.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.imagen} />
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text>💲 {item.precio.toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() => eliminarDelCarrito(index)}
                style={[styles.botonAgregar, { backgroundColor: 'red' }]}
              >
                <Text style={{ color: '#fff' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={styles.carrito}>
          <Text>🧾 Artículos: {carrito.length}</Text>
          <Text>💰 Total: ${total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {/* Botón flotante Comprar */}
      <View style={styles.botonFijo}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Pago', { total })}
          style={[styles.botonIrCarrito, { backgroundColor: '#28a745' }]}
        >
          <Text style={styles.textoBoton}>💳 Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PagoScreen({ route }) {
  const { total } = route.params;

  const confirmarPago = (metodo) => {
    Alert.alert('✅ Pago confirmado', `Has pagado $${total.toFixed(2)} con ${metodo}. ¡Gracias por tu compra!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9f9f9' }]}>
      <Text style={styles.subtitulo}>💳 Opciones de pago</Text>
      <TouchableOpacity onPress={() => confirmarPago('Tarjeta de crédito')} style={styles.botonAgregar}>
        <Text style={{ color: '#fff' }}>Tarjeta de crédito</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmarPago('PayPal')} style={styles.botonAgregar}>
        <Text style={{ color: '#fff' }}>PayPal</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmarPago('Transferencia bancaria')} style={styles.botonAgregar}>
        <Text style={{ color: '#fff' }}>Transferencia bancaria</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetalleProductoScreen({ route }) {
  const { producto, agregarAlCarrito } = route.params;

  const promedioEstrellas = (reseñas) => {
    const total = reseñas.reduce((sum, r) => sum + r, 0);
    return Math.round(total / reseñas.length);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#f9f9f9' }]}>
      <Text style={styles.subtitulo}>{producto.nombre}</Text>
      <Image source={{ uri: producto.imagen }} style={styles.imagen} />
      <Text style={{ fontSize: 18, marginBottom: 10 }}>💲 {producto.precio.toFixed(2)}</Text>
      <Text style={{ marginBottom: 10 }}>Descripción: Este es un excelente producto de calidad premium que no te puedes perder.</Text>
      <Text style={styles.subtitulo}>⭐ Reseñas</Text>
      <View style={styles.estrellas}>
        {Array(promedioEstrellas(producto.reseñas))
          .fill()
          .map((_, i) => (
            <Text key={i}>⭐</Text>
          ))}
      </View>
      <View style={{ marginBottom: 20 }}>
        {producto.reseñas.map((r, index) => (
          <Text key={index}>⭐ {r} estrellas - ¡Muy buen producto!</Text>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => agregarAlCarrito(producto)}
        style={[styles.botonAgregar, { backgroundColor: '#28a745' }]}
      >
        <Text style={{ color: '#fff' }}>🛒 Agregar al carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Carrito" component={CarritoScreen} />
        <Stack.Screen name="Pago" component={PagoScreen} />
        <Stack.Screen name="Detalle" component={DetalleProductoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  paddingTop: StatusBar.currentHeight || 40, 
  height: 60 + (StatusBar.currentHeight || 40),
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 10,
  elevation: 5,
  zIndex: 1000,
},
menuIcon: {
  fontSize: 28,
  position: '',
  left: -100,
},
titulo: {
  fontSize: 24,
  fontWeight: 'bold',
},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  imagen: {
    width: '100%',
    height: 200,
    marginBottom: 5,
  },
  imagenDestacada: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
  nombre: {
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carrito: {
    padding: 10,
    backgroundColor: '#eee',
    marginTop: 10,
  },
  botonFijo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  botonIrCarrito: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  destacadoCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    width: 140,
  },
  menuLateral: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#fff',
    padding: 10,
    zIndex: 999,
    elevation: 5,
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 10,
  },
  menuCerrar: {
    fontSize: 16,
    color: 'red',
  },
  estrellas: {
    flexDirection: 'row',
    marginVertical: 5,
  },
});
