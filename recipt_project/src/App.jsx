import React, { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [discount, setDiscount] = useState("");
  const [paid, setPaid] = useState("");
  const [editingId, setEditingId] = useState(null);
  const receiptRef = useRef();

  // Add or Update Item
  const handleSubmit = () => {
    if (!name || qty <= 0 || !price) return;

    if (editingId) {
      // update existing item
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId ? { ...it, name, qty: Number(qty), price: Number(price) } : it
        )
      );
      setEditingId(null);
    } else {
      // add new item
      const id = Date.now();
      setItems((s) => [...s, { id, name, qty: Number(qty), price: Number(price) }]);
    }

    setName("");
    setQty(1);
    setPrice("");
  };

  const handleEdit = (item) => {
    setName(item.name);
    setQty(item.qty);
    setPrice(item.price);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handlePrint = () => {
    window.print(); // 🔹 Browser ka print dialog open karega
  };

  const subtotal = items.reduce((acc, it) => acc + it.qty * it.price, 0);
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;
  const discountAmount = Number(discount || 0);
  const total = subtotal + taxAmount - discountAmount;
  const change = Number(paid || 0) - total;

  return (
    <div className="app">
      <div className="container">
        {/* Controls */}
        <div className="card">
          <h2 className="title">{editingId ? "Edit Item" : "Add Item"}</h2>

          <div className="form">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name (e.g. Pepsi)"
            />
            <div className="row">
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(Number(e.target.value))}
                placeholder="Quantity"
              />
              <input
                type="number"
                value={price}
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price (Rs)"
              />
            </div>
            <div className="row">
              <button onClick={handleSubmit} className="btn primary">
                {editingId ? "Update Item" : "Add Item"}
              </button>
              <button
                onClick={() => {
                  setName("");
                  setQty(1);
                  setPrice("");
                  setEditingId(null);
                }}
                className="btn"
              >
                Clear
              </button>
            </div>
          </div>

          <hr />

          <div className="form">
            <input
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="Tax % (e.g. 10)"
            />
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount (Rs)"
            />
            <input
              type="number"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="Paid Amount"
            />
            <p className="note">
              Enter item details like <em>name</em>, <em>quantity</em>, and <em>price</em> to build
              your receipt.  
              You can also apply <em>tax</em>, <em>discount</em>, and enter the <em>paid amount</em>{" "}
              — the tool will calculate the totals automatically.  
              For customization or support: <strong>codeswithsamad@gmail.com</strong>
            </p>
          </div>
        </div>

        {/* Receipt */}
        <div className="card">
          <h2 className="title">Samad Express</h2>
          <div ref={receiptRef} className="receipt">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>{it.price.toFixed(2)}</td>
                    <td>{(it.qty * it.price).toFixed(2)}</td>
                    <td>
                      <button className="btn small" onClick={() => handleEdit(it)}>
                        Edit
                      </button>
                      <button className="btn danger small" onClick={() => handleDelete(it.id)}>
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals">
              <p>
                Subtotal: <strong>{subtotal.toFixed(2)}</strong>
              </p>
              <p>
                Tax ({taxPercent || 0}%): <strong>{taxAmount.toFixed(2)}</strong>
              </p>
              <p>
                Discount: <strong>- {discountAmount.toFixed(2)}</strong>
              </p>
              <p>
                Total: <strong>{total.toFixed(2)}</strong>
              </p>
              <p>
                Paid: <strong>{Number(paid || 0).toFixed(2)}</strong>
              </p>
              <p>
                Change: <strong>{change >= 0 ? change.toFixed(2) : "0.00"}</strong>
              </p>

              <p className="note">
                This section shows the full calculation of your receipt — including{" "}
                <em>subtotal</em>, <em>tax</em>, <em>discount</em>, and the <em>final total</em>.  
                After entering the <em>paid amount</em>, the tool will automatically calculate the{" "}
                <em>change</em> to return.  
                For customization or support: <strong>codeswithsamad@gmail.com</strong>
              </p>
            </div>
          </div>

          {/* 🔹 Print Button Added */}
          <button onClick={handlePrint} className="btn primary" style={{ marginTop: "10px" }}>
            Print Receipt 🖨️
          </button>
        </div>
      </div>
      <footer className="footer"> Built by Abdul Samad 😎 </footer>
    </div>
  );
}
