import { Categories, User } from "@/types";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatarCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const isValidEmail = (email: string) => {
  if (!email) return;

  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailPattern.test(email);
};

export const removerMascaraCPF = (cpf: string) => {
  return cpf.replace(/\D/g, "");
};

export const formatarTelefone = (numero: string) => {
  const numeros = numero.replace(/\D/g, "");
  const formatado = numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return formatado;
};

export const primeiraMaiuscula = (
  text: string | undefined
): string | undefined => {
  if (text) {
    return text
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }
  return text;
};

interface FormDataValidation {
  formData: Record<string, string | number | boolean>;
}

export const validarInputsObrigatorios = ({
  formData,
}: FormDataValidation): boolean => {
  return Object.values(formData).every((value) => value !== "");
};

export const gerarDataAtual = (
  data: Date | string,
  mostrarHora: boolean = true
): string => {
  const dataObj = typeof data === "string" ? new Date(data) : data;

  if (mostrarHora) {
    return format(dataObj, "dd/MM/yyyy - HH:mm", { locale: ptBR });
  }
  return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
};

export const formatarDataHora = (dataISO: string): string => {
  if (!dataISO) return "";

  const date = new Date(dataISO);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${horas}h${minutos}`;
};

export const dateFormatter = (dateString: string) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const mascararData = (dateString: string): string => {
  if (!dateString) return "";
  const data = parseISO(dateString);
  if (isValid(data)) {
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  }
  return "";
};

export const formatarData = (dataString: string): string => {
  if (!dataString) return "";

  const dateSplit = dataString.split("/");
  const data = new Date(
    parseInt(dateSplit[2]),
    parseInt(dateSplit[1]) - 1,
    parseInt(dateSplit[0])
  );
  const opcoes: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  let dataFormatada = data.toLocaleDateString("pt-BR", opcoes);
  dataFormatada = dataFormatada.replace(".", "");
  dataFormatada = dataFormatada.replace("de", "");

  return dataFormatada;
};

export function capitalize(str?: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function capitalizeFirstLastName(str?: string) {
  if (!str) return "";

  const words = str.split(" ");

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  const firstName =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const lastName =
    words[words.length - 1].charAt(0).toUpperCase() +
    words[words.length - 1].slice(1).toLowerCase();

  return `${firstName} ${lastName}`;
}

export const getYearFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

export function formatDate(date: Date | string | undefined): string {
  if (date instanceof Date) {
    return date?.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return date
    ? new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
}

export function extrairNumero(string: string): number | null {
  const resultado = string?.match(/\d+/);
  return resultado ? parseInt(resultado[0], 10) : null;
}

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function getCategoryNameById(
  categoryId: string,
  categories: Categories[]
): string {
  if (!categories || !categoryId) return "N/A";

  const category = categories.find((cat) => cat._id === categoryId);
  return category ? category.name : "N/A";
}

export function findUserById(
  userId: string,
  users: User[] | null
): User | null {
  if (!users) return null;
  return users.find((user) => user._id === userId) || null;
}
