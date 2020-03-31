const getInitials = (string = '') => {
  const names = string.split(' ');
  let initials = '';

  names.forEach(name => {
    initials += name.substring(0, 1).toUpperCase();
  });

  return initials;
};

export default getInitials;
