import * as chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../authContext/authContext";
import SidebarContent from "../layouts/SidebarContent"; 
import MobileNav from "../layouts/MobileNav";
import SettingsModal from "../components/settings/SettingsModal";
import Loader from "../../../commons/Loader";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
Chart.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const fontName = "Inter";

// Helper to convert JSON to CSV
function exportToCSV(data, filename) {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(","),
    ...data.map(row =>
      keys.map(k => {
        const val = row[k] == null ? "" : String(row[k]).replace(/"/g, '""');
        return `"${val}"`;
      }).join(",")
    ),
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const { account, isLoading } = useAuth(); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthContextLoading = isLoading || false;
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [dailySales, setDailySales] = useState([]);
  const [dailySalesLoading, setDailySalesLoading] = useState(true);
  const [dailyOrdersGross, setDailyOrdersGross] = useState([]);
  const [dailyOrdersGrossLoading, setDailyOrdersGrossLoading] = useState(true);
  const [monthlyOrdersGross, setMonthlyOrdersGross] = useState([]);
  const [monthlyOrdersGrossLoading, setMonthlyOrdersGrossLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    setSummaryLoading(true);
    fetchSummaryReport()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));

    setDailySalesLoading(true);
    fetchDailySales()
      .then(setDailySales)
      .catch(() => setDailySales([]))
      .finally(() => setDailySalesLoading(false));

    setDailyOrdersGrossLoading(true);
    fetchDailyOrdersGross()
      .then(setDailyOrdersGross)
      .catch(() => setDailyOrdersGross([]))
      .finally(() => setDailyOrdersGrossLoading(false));
    
    setMonthlyOrdersGrossLoading(true);
    fetchMonthlyOrdersGross()
      .then(setMonthlyOrdersGross)
      .catch(() => setMonthlyOrdersGross([]))
      .finally(() => setMonthlyOrdersGrossLoading(false));
  }, []);

  const fetchSummaryReport = async () => {
    const res = await axios.get("https://api.assolutionsfournitures.fr/api/reports/summary", {
      withCredentials: true,
    });
    return res.data.data;
  };

  const fetchDailySales = async () => {
    const res = await axios.get("https://api.assolutionsfournitures.fr/api/reports/daily-sales-last-month", {
      withCredentials: true,
    });
    return res.data.data;
  };

  const fetchDailyOrdersGross = async () => {
    const res = await axios.get("https://api.assolutionsfournitures.fr/api/reports/daily-orders-gross-last-month", {
      withCredentials: true,
    });
    return res.data.data;
  };

  const fetchMonthlyOrdersGross = async () => {
    const res = await axios.get("https://api.assolutionsfournitures.fr/api/reports/monthly-orders-gross-this-year", {
      withCredentials: true,
    });
    return res.data.data;
  };

  // NEW: Export handler
  const handleExportOrders = async (period) => {
    setExportLoading(true);
    try {
      const res = await axios.get(
        `https://api.assolutionsfournitures.fr/api/reports/export-orders?period=${period}`,
        { withCredentials: true }
      );
      exportToCSV(res.data.data, `orders_export_${period}.csv`);
    } catch (err) {
      alert("Failed to export orders.");
    } finally {
      setExportLoading(false);
    }
  };

  const chartData = {
    labels: dailySales.map((d) => d.date),
    datasets: [
      {
        label: "Daily Sales (€)",
        data: dailySales.map((d) => d.total_sales),
        fill: false,
        borderColor: "#3182ce",
        backgroundColor: "#3182ce",
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Sales (€)" }, beginAtZero: true },
    },
  };

  // NEW: Monthly bar chart data
  const monthlyBarData = {
    labels: monthlyOrdersGross.map((m) => m.date),
    datasets: [
      {
        label: "Gross Sales (€)",
        data: monthlyOrdersGross.map((m) => m.sales_gross),
        backgroundColor: "#3182ce",
        borderRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: monthlyOrdersGross.map((m) => m.orders_count),
        backgroundColor: "#63b3ed",
        borderRadius: 4,
        yAxisID: "y1",
      },
    ],
  };

  const monthlyBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Month" } },
      y: {
        title: { display: true, text: "Gross Sales (€)" },
        beginAtZero: true,
        position: "left",
      },
      y1: {
        title: { display: true, text: "Orders" },
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
  };

  if(isAuthContextLoading) {
    return <Loader />;
  }

  return (
    <>
      <chakra.Box minH="100vh" bg="rgb(241,241,241)">
        <chakra.Box display={{ base: "none", md: "block" }}>
          <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        </chakra.Box>
        {/* Mobile Sidebar: shown when menu is open */}
        <chakra.Box
          display={{ base: isSidebarOpen ? "block" : "none", md: "none" }}
          position="fixed"
          zIndex={999}
        >
          <SidebarContent
            onSettingsOpen={() => setIsSettingsOpen(true)}
            onClose={() => setIsSidebarOpen(false)}
          />
        </chakra.Box>
        {/* MobileNav: always visible, passes menu toggle */}
        <MobileNav
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onOpen={() => setIsSidebarOpen(true)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <chakra.Box ml={{ base: 0, md: 60 }} p="5">
          <chakra.Text
            color="gray.900"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontFamily={fontName}
            fontWeight="light"
            textAlign={{ base: "left", md: "left" }}
          >
            Good Afternoon,{" "}
            {account?.preferred_name || account?.first_name || "User"}
          </chakra.Text>
          <chakra.Text color="gray.700" mt={4}>
            Welcome to your dashboard.
          </chakra.Text>

          <chakra.Box mt={8}>
            <chakra.Heading fontSize="xl" mb={4}>
              Business Summary
            </chakra.Heading>
            {summaryLoading ? (
              <chakra.Text>Loading summary...</chakra.Text>
            ) : summary ? (
              <chakra.SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
              >
                <chakra.Box bg="white" p={5} borderRadius="md" boxShadow="sm">
                  <chakra.Text fontSize="sm" color="gray.500">
                    Total Orders
                  </chakra.Text>
                  <chakra.Text fontSize="2xl" fontWeight="bold">
                    {summary.total_orders}
                  </chakra.Text>
                </chakra.Box>
                <chakra.Box bg="white" p={5} borderRadius="md" boxShadow="sm">
                  <chakra.Text fontSize="sm" color="gray.500">
                    First Time Orders
                  </chakra.Text>
                  <chakra.Text fontSize="2xl" fontWeight="bold">
                    {summary.first_time_orders}
                  </chakra.Text>
                </chakra.Box>
                <chakra.Box bg="white" p={5} borderRadius="md" boxShadow="sm">
                  <chakra.Text fontSize="sm" color="gray.500">
                    Sales Gross
                  </chakra.Text>
                  <chakra.Text fontSize="2xl" fontWeight="bold">
                    €
                    {summary.sales_gross.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </chakra.Text>
                </chakra.Box>
                <chakra.Box bg="white" p={5} borderRadius="md" boxShadow="sm">
                  <chakra.Text fontSize="sm" color="gray.500">
                    Sales Nett
                  </chakra.Text>
                  <chakra.Text fontSize="2xl" fontWeight="bold">
                    €
                    {summary.sales_nett.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </chakra.Text>
                </chakra.Box>
                <chakra.Box bg="white" p={5} borderRadius="md" boxShadow="sm">
                  <chakra.Text fontSize="sm" color="gray.500">
                    New Customers
                  </chakra.Text>
                  <chakra.Text fontSize="2xl" fontWeight="bold">
                    {summary.new_customers}
                  </chakra.Text>
                </chakra.Box>
              </chakra.SimpleGrid>
            ) : (
              <chakra.Text color="red.500">Failed to load summary.</chakra.Text>
            )}
          </chakra.Box>

          <chakra.Box mt={12}>
            <chakra.Heading fontSize="lg" mb={4}>
              Daily Sales (Last 30 Days)
            </chakra.Heading>
            {dailySalesLoading ? (
              <chakra.Text>Loading chart...</chakra.Text>
            ) : (
              <chakra.Box bg="white" p={4} borderRadius="md" boxShadow="sm">
                <Line data={chartData} options={chartOptions} height={120} />
              </chakra.Box>
            )}
          </chakra.Box>

          <chakra.Box mt={12}>
            <chakra.Heading fontSize="lg" mb={4}>
              Daily Orders & Gross Sales (Last 30 Days)
            </chakra.Heading>
            {dailyOrdersGrossLoading ? (
              <chakra.Text>Loading table...</chakra.Text>
            ) : (
              <chakra.Box bg="white" p={4} borderRadius="md" boxShadow="sm" overflowX="auto">
                <chakra.Table variant="simple" size="sm">
                  <chakra.Thead>
                    <chakra.Tr>
                      <chakra.Th>Date</chakra.Th>
                      <chakra.Th isNumeric>Orders</chakra.Th>
                      <chakra.Th isNumeric>Gross Sales (€)</chakra.Th>
                    </chakra.Tr>
                  </chakra.Thead>
                  <chakra.Tbody>
                    {dailyOrdersGross.map((row) => (
                      <chakra.Tr key={row.date}>
                        <chakra.Td>{row.date}</chakra.Td>
                        <chakra.Td isNumeric>{row.orders_count}</chakra.Td>
                        <chakra.Td isNumeric>
                          {row.sales_gross.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </chakra.Td>
                      </chakra.Tr>
                    ))}
                  </chakra.Tbody>
                </chakra.Table>
              </chakra.Box>
            )}
          </chakra.Box>
          
          <chakra.Box mt={12}>
            <chakra.Heading fontSize="lg" mb={4}>
              Monthly Orders & Gross Sales (This Year)
            </chakra.Heading>
            {monthlyOrdersGrossLoading ? (
              <chakra.Text>Loading chart...</chakra.Text>
            ) : (
              <chakra.Box bg="white" p={4} borderRadius="md" boxShadow="sm">
                <Bar data={monthlyBarData} options={monthlyBarOptions} height={120} />
              </chakra.Box>
            )}
          </chakra.Box>

          <chakra.Box mt={12}>
            <chakra.Heading fontSize="lg" mb={4}>
              Export Orders
            </chakra.Heading>
            <chakra.HStack spacing={4} flexWrap="wrap">
              {[
                { label: "Current Month", value: "current_month" },
                { label: "Current Quarter", value: "current_quarter" },
                { label: "Current Year", value: "current_year" },
                { label: "Last Month", value: "last_month" },
                { label: "Month Before Last", value: "month_before_last" },
                { label: "Last Quarter", value: "last_quarter" },
                { label: "Last Year", value: "last_year" },
              ].map(opt => (
                <chakra.Button
                  key={opt.value}
                  colorScheme="blue"
                  size="sm"
                  isLoading={exportLoading}
                  onClick={() => handleExportOrders(opt.value)}
                >
                  {opt.label}
                </chakra.Button>
              ))}
            </chakra.HStack>
            <chakra.Text fontSize="sm" color="gray.500" mt={2}>
              Exported as CSV with all order and line item details.
            </chakra.Text>
          </chakra.Box>

        </chakra.Box>
      </chakra.Box>
    </>
  );
}