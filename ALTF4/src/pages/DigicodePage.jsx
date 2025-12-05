import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DigicodePage() {
    const navigate = useNavigate();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const ok = localStorage.getItem("keysValidated") === "true";
        if (!ok) {
            navigate("/keys");
        } else {
            setAllowed(true);
        }
    }, []);

    if (!allowed) return null;

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">Digicode</h1>

            <h1 className="text-3xl font-bold mb-4"> Indices...</h1>

            <p className="text-gray-600">Indice 1 : 1 2 </p>
            <p className="text-gray-600">Indice 2 : 3 4 </p>
            <p className="text-gray-600">Indice 3 : 5 6 </p>


            {/* Ici tu mets ton digicode */}
            <p>Entrer le code final…</p>
        </div>
    );
}
