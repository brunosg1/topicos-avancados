module.exports = {
  content: [
    "./index.html", // <- Adicione esta linha
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        fundoAgricola: '#f5f9f2',
        verdePrincipal: '#2f855a',
        verdeEscuro: '#22543d',
        verdeClaro: '#68d391',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
