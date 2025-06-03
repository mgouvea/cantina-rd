import { Categories, GroupFamily, User } from "@/types";

export const isValidEmail = (email: string) => {
  if (!email) return;

  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailPattern.test(email);
};

export const formatarTelefone = (numero: string) => {
  const numeros = numero.replace(/\D/g, "");
  const formatado = numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return formatado;
};

export const removerMascaraTelefone = (telefone: string) => {
  if (!telefone) return "";
  return telefone.replace(/\D/g, "");
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

export function formatTime(date: Date | string | undefined): string {
  if (date instanceof Date) {
    return date?.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date
    ? new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
}

export function formatDateTime(date: Date | string | undefined): string {
  if (date instanceof Date) {
    return date?.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date
    ? new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
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

export function getGroupFamilyNameById(
  groupFamilyId: string,
  groupFamilies: GroupFamily[]
): string {
  if (!groupFamilies || !groupFamilyId) return "N/A";
  const groupFamily = groupFamilies.find(
    (groupFamily) => groupFamily._id === groupFamilyId
  );
  return groupFamily ? groupFamily.name : "N/A";
}
