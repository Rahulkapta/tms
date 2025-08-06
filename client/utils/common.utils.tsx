export const getInitials = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return lastInitial ? firstInitial + lastInitial : firstInitial;
};

export const filtered = (chats: any[], search: string) => {
  const lowerSearch = search.toLowerCase();

  return chats
    .filter((chat) => {
      // Construct full name, fallback safely if name or details missing
      const first = chat.details?.name?.first || "";
      const last = chat.details?.name?.last || "";
      const fullName = `${first} ${last}`.trim().toLowerCase();

      return fullName.includes(lowerSearch);
    })
    .sort((a, b) => {
      const aFirst = a.details?.name?.first || "";
      const aLast = a.details?.name?.last || "";
      const aFull = `${aFirst} ${aLast}`.trim().toLowerCase();

      const bFirst = b.details?.name?.first || "";
      const bLast = b.details?.name?.last || "";
      const bFull = `${bFirst} ${bLast}`.trim().toLowerCase();

      const aStarts = aFull.startsWith(lowerSearch);
      const bStarts = bFull.startsWith(lowerSearch);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
};
