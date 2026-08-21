import { Text } from '@/components/ui/text';
import { Check, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type PickerModalProps<T> = {
  visible: boolean;
  title: string;
  onClose: () => void;
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  isSelected: (item: T) => boolean;
  onSelect: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Requerido para que `searchable` filtre. Recibe la query ya en minusculas. */
  filterFn?: (item: T, query: string) => boolean;
  emptyText?: string;
  /** En multiSelect el modal no se cierra al elegir; aparece un boton "Listo". */
  multiSelect?: boolean;
};

/**
 * Hoja inferior para elegir de una lista, con buscador opcional.
 *
 * Es generico en T y no asume la forma de los datos: la pantalla decide como
 * se dibuja cada fila (`renderItem`) y que cuenta como seleccionado
 * (`isSelected`). Suele usarse junto a SelectCard.
 */
export function PickerModal<T>({
  visible,
  title,
  onClose,
  data,
  keyExtractor,
  renderItem,
  isSelected,
  onSelect,
  searchable,
  searchPlaceholder,
  filterFn,
  emptyText,
  multiSelect,
}: PickerModalProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchable || !filterFn) return data;
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => filterFn(item, q));
  }, [data, query, searchable, filterFn]);

  // La busqueda se limpia al cerrar: si no, al reabrir aparece filtrada sin
  // que se vea por que.
  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/40" onPress={handleClose} />
      <View
        className="rounded-t-3xl bg-white"
        style={{
          height: Dimensions.get('window').height * 0.75,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 16,
        }}
      >
        <SafeAreaView edges={['bottom']} className="flex-1">
          <View className="items-center pb-1 pt-3">
            <View className="h-1 w-10 rounded-full bg-slate-300" />
          </View>

          <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
            <Text className="text-lg font-semibold text-slate-800">{title}</Text>
            <Pressable onPress={handleClose} hitSlop={12} className="p-1 active:opacity-60">
              <X size={22} color="#475569" />
            </Pressable>
          </View>

          {searchable ? (
            <View className="px-5 pb-2">
              <View className="h-12 flex-row items-center rounded-2xl bg-slate-100 px-3">
                <Search size={18} color="#64748b" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#94a3b8"
                  autoCorrect={false}
                  returnKeyType="search"
                  className={`ml-2 flex-1 text-slate-800 ${
                    Platform.OS === 'ios' ? 'py-2' : ''
                  }`}
                />
              </View>
            </View>
          ) : null}

          <FlatList
            className="flex-1"
            data={filtered}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View className="mx-5 h-px bg-slate-100" />}
            ListEmptyComponent={
              <Text className="mt-8 px-5 text-center text-sm text-slate-400">
                {emptyText ?? 'Sin resultados'}
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => {
              const selected = isSelected(item);
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    if (!multiSelect) handleClose();
                  }}
                  className="flex-row items-center px-5 py-3 active:bg-slate-100"
                >
                  <View className="flex-1">{renderItem(item, selected)}</View>
                  {selected ? (
                    <View
                      className={`${
                        multiSelect ? 'h-6 w-6 rounded-md' : 'h-6 w-6 rounded-full'
                      } ml-3 items-center justify-center bg-blue-700`}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  ) : multiSelect ? (
                    <View className="ml-3 h-6 w-6 rounded-md border-2 border-slate-300" />
                  ) : null}
                </Pressable>
              );
            }}
          />

          {multiSelect ? (
            <View className="border-t border-slate-100 bg-white px-5 pb-2 pt-3">
              <Pressable
                onPress={handleClose}
                className="h-12 items-center justify-center rounded-2xl bg-blue-700 active:opacity-80"
                style={{
                  shadowColor: '#1d4ed8',
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <Text className="font-semibold text-white">Listo</Text>
              </Pressable>
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
