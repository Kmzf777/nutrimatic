# Prompt de Desenvolvimento: Página de Formulário Público (Anamnese)

Você é um Engenheiro de Software Sênior especialista em **Next.js (App Router)**, **React**, **Tailwind CSS** e **Supabase**.

Sua tarefa é desenvolver a página pública de resposta do formulário, que será acessada através da URL `forms.nutrimatic.com.br/[id]`.

## 1. Contexto e Objetivo
O sistema Nutrimatic permite que nutricionistas criem formulários de anamnese personalizados. Esses formulários são salvos no banco de dados e geram um link único.
Precisamos criar a aplicação (ou rota) que renderiza esse formulário para o paciente final, coleta as respostas e salva no banco de dados.

## 2. Estrutura do Banco de Dados (Supabase)

O formulário é montado dinamicamente com base em um template salvo.

### Tabela: `anamnesis_templates`
Esta tabela já existe e contém a estrutura do formulário.
- **id** (UUID, Primary Key): O identificador único do formulário (o `[slug]` da URL).
- **title** (Text): Título do formulário (ex: "Anamnese Nutricional").
- **description** (Text): Instruções ou descrição para o paciente.
- **questions** (JSONB): Array de objetos definindo os campos.
  - Estrutura do JSON:
    ```json
    [
      {
        "id": "field_123",
        "type": "text | number | select | checkbox | textarea",
        "label": "Qual seu nome?",
        "required": true,
        "placeholder": "Digite aqui...",
        "options": ["Opção A", "Opção B"] // Apenas para select/checkbox
      }
    ]
    ```
- **nutricionista_id** (UUID): Referência ao nutricionista dono do formulário.

### Tabela: `anamnesis_responses` (A Criar/Verificar)
Você precisará garantir que existe uma tabela para salvar as respostas dos pacientes.
- **id** (UUID, PK)
- **template_id** (UUID, FK -> anamnesis_templates.id)
- **answers** (JSONB): Objeto contendo as respostas (ex: `{"field_123": "João Silva"}`).
- **created_at** (Timestamp)

## 3. Arquitetura e Organização de Arquivos (Next.js App Router)

A aplicação deve utilizar o **App Router** do Next.js.
Como a URL é `forms.nutrimatic.com.br/[id]`, a "Home Page" desta rota deve ser dinâmica baseada no ID.

### Estrutura de Pastas Sugerida:
```
src/
  app/
    [id]/               // Rota dinâmica que captura o ID do formulário
      page.tsx          // Server Component: Busca os dados e renderiza o esqueleto
      FormBuilder.tsx   // Client Component: Gerencia o estado do formulário e submissão
    layout.tsx          // Layout limpo, focado na leitura (sem sidebar de dashboard)
  lib/
    supabase.ts         // Cliente Supabase
  components/
    ui/                 // Componentes reutilizáveis (Input, Button, Card)
```

## 4. Design e UX (Tailwind CSS)

O design deve ser **minimalista, moderno e responsivo (Mobile First)**, transmitindo confiança e profissionalismo.

- **Container**: Centralizado, largura máxima de `max-w-2xl`, com sombreamento suave (`shadow-sm`) e bordas arredondadas (`rounded-xl`).
- **Tipografia**: Use fontes sans-serif limpas (Inter ou similar). Títulos em destaque, textos de apoio em cinza neutro (`text-gray-500`).
- **Campos**:
  - Inputs grandes e confortáveis para toque (altura mínima de 44px).
  - Foco com anel de cor primária (`focus:ring-nutrimatic-500`).
  - Labels claros acima dos inputs.
- **Feedback**:
  - Validação de campos obrigatórios antes do envio.
  - Loading state no botão de enviar ("Enviando...").
  - Tela de "Sucesso" após o envio (ex: "Obrigado! Suas respostas foram enviadas.").

## 5. Passo a Passo de Desenvolvimento

Siga estas etapas para implementar a solução:

1.  **Configuração da Rota Dinâmica (`[id]/page.tsx`)**:
    - Crie a pasta `[id]` no diretório `app`.
    - No `page.tsx` (Server Component), capture o `params.id`.
    - Realize o fetch dos dados na tabela `anamnesis_templates` usando o ID.
    - Trate erros: Se o ID não existir, exiba uma página 404 personalizada ("Formulário não encontrado").

2.  **Renderização do Formulário (`FormBuilder.tsx`)**:
    - Crie um componente cliente que recebe `questions`, `title` e `description` como props.
    - Utilize um mapa de componentes para renderizar o input correto baseado no `type` de cada pergunta (`text`, `number`, `select`, etc.).
    - Gerencie o estado das respostas em um objeto (ex: `const [answers, setAnswers] = useState({})`).

3.  **Lógica de Submissão**:
    - Crie uma função `handleSubmit`.
    - Valide se todos os campos `required` foram preenchidos.
    - Envie os dados para a tabela `anamnesis_responses` no Supabase.
    - Exiba feedback de erro ou sucesso.

4.  **Estilização Final**:
    - Aplique as classes do Tailwind para garantir que o formulário seja bonito e funcional em celulares e desktops.
    - Adicione uma barra de progresso simples ou indicador de etapas se o formulário for longo (opcional/bônus).

---
**Observação Importante**: O foco é a experiência do paciente. O formulário deve ser extremamente fácil de preencher.
