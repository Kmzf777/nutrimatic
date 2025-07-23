# Fonte MuseoModerno - Guia de Uso

## Visão Geral

A fonte **MuseoModerno** foi implementada no projeto Nutrimatic para ser usada em:
- **Palavras com gradiente** - Aplicada automaticamente aos elementos com `text-gradient`
- **Palavras em destaque** - Usando classes específicas
- **Elementos de marca** - Para destacar a identidade visual

## Implementação

### 1. Import da Fonte
A fonte foi importada no arquivo `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=MuseoModerno:ital,wght@0,100..900;1,100..900&display=swap');
```

### 2. Configuração no Tailwind
Adicionada no `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['MuseoModerno', 'sans-serif'],
},
```

### 3. Classes CSS Disponíveis

#### Classes Principais
- `.font-display` - Aplica a fonte MuseoModerno
- `.text-display` - Aplica a fonte MuseoModerno
- `.heading-display` - Aplica a fonte com estilos de heading
- `.brand-text` - Aplica a fonte com peso 600 (para marca)

#### Uso com Gradientes
- `.text-gradient.font-display` - Combina gradiente com a fonte MuseoModerno

## Exemplos de Uso

### 1. Palavras com Gradiente (Automático)
Todos os elementos com a classe `text-gradient` usam a fonte MuseoModerno automaticamente.

### 2. Palavras em Destaque
```jsx
<h2 className="text-gray-900 mb-6">
  Nutrimatic faz <span className="text-gradient">MUITO MAIS</span> que IA para prescrições
</h2>
```

### 3. Elementos de Marca
```jsx
<span className="font-semibold text-white font-display">Nutrimatic</span>
```

### 4. Números e Estatísticas
```jsx
<span className="text-nutrimatic-600 font-bold text-2xl font-display">10 horas por semana</span>
```

## Classes Tailwind Disponíveis

### Font Family
- `font-display` - Aplica a fonte MuseoModerno

### Exemplos de Combinação
```jsx
// Título com gradiente (fonte MuseoModerno automática)
<h1 className="text-gradient">Título Principal</h1>

// Palavra em destaque
<span className="text-nutrimatic-600 font-display">Destaque</span>

// Número importante
<div className="text-4xl font-bold font-display">1.000+</div>
```

## Padrões de Uso

### 1. Palavras com Gradiente
- Use `text-gradient` para palavras-chave em títulos (a fonte MuseoModerno será aplicada automaticamente)
- Mantenha o resto do texto na fonte Inter para legibilidade

### 2. Elementos de Marca
- Use `font-display` para o nome "Nutrimatic"
- Use `font-display` para números e estatísticas importantes

### 3. Call-to-Actions
- Use `text-gradient` para destacar palavras-chave em CTAs (a fonte MuseoModerno será aplicada automaticamente)
- Mantenha o texto principal na fonte Inter

## Boas Práticas

1. **Não abuse da fonte** - Use apenas para elementos que realmente precisam de destaque
2. **Mantenha a legibilidade** - A fonte Inter continua sendo a principal para texto corrido
3. **Consistência** - Use sempre as mesmas classes para elementos similares
4. **Hierarquia visual** - A fonte MuseoModerno deve criar hierarquia, não confusão

## Exemplos Implementados

### HeroSection
- "piloto automático" - `text-gradient` (fonte automática)
- "Nutrimatic" - `font-semibold text-white font-display`

### FeaturesSection
- "MUITO MAIS" - `text-gradient` (fonte automática)
- "Nutrimatic?" - `text-gradient` (fonte automática)

### CTASection
- "5 minutos" - `text-gradient` (fonte automática)

### TestimonialsSection
- "nutricionistas" - `text-gradient` (fonte automática)

### FAQSection
- "comuns" - `text-gradient` (fonte automática)

### TimeSavingsSection
- "economiza?" - `text-gradient` (fonte automática)
- "10 horas por semana" - `text-nutrimatic-600 font-bold text-2xl font-display`

### HowItWorksSection
- "3 passos simples" - `text-gradient` (fonte automática) 