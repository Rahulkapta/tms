  export const getTimeAgo = (isoDate:string) => {
  const now = new Date(); // current time in the user's timezone
  const created = new Date(isoDate); // createdAt from your backend

  const diffMs = now.getTime() - created.getTime();// difference in milliseconds

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m`;
  } else {
    return `1s`;
  }
};