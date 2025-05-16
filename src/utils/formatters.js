import { useNavigate } from "react-router-dom";

export const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const handleAddEntry = () => {
    const navigate = useNavigate;
    navigate("/financial-entries/new");
};

export const handleEditEntry = (id) => {
    const navigate = useNavigate;
    navigate(`/financial-entries/${id}/edit`);
};