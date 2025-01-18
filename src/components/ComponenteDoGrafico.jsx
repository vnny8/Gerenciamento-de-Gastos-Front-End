import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";

const ComponenteDoGrafico = ({ data, chartType }) => {
  // Mapeia os dados para calcular porcentagens e valores
  const totalGasto = data.reduce((acc, gasto) => acc + gasto.valor, 0);
  const categoryMap = data.reduce((acc, gasto) => {
    if (!acc[gasto.categoria]) {
      acc[gasto.categoria] = { total: 0, color: gasto.corCategoria };
    }
    acc[gasto.categoria].total += gasto.valor;
    return acc;
  }, {});

  const labels = Object.keys(categoryMap);
  const valores = Object.values(categoryMap).map((item) => item.total);
  const cores = Object.values(categoryMap).map((item) => item.color);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Gastos por Categoria", // Adicionado para gráficos de barra
        data: valores,
        backgroundColor: cores,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const label = labels[index];
            const valor = valores[index];
            const porcentagem = ((valor / totalGasto) * 100).toFixed(2);
            return `${label}: ${porcentagem}% (${valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })})`;
          },
        },
      },
      legend: {
        display: chartType === "pie",
        position: "bottom",
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: chartType === "bar" ? { // Configura eixos para gráfico de barras
      x: {
        type: "category",
        labels,
        title: {
          display: true,
          text: "Categorias",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Valores (R$)",
        },
      },
    } : {}, // Sem escalas para gráfico de pizza
  };

  return (
    <div className="w-full h-full">
      {chartType === "pie" && (
        <Doughnut data={chartData} options={options} />
      )}
      {chartType === "bar" && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default ComponenteDoGrafico;
