import { S } from '../styles';

export default function FaqTab({ newFaq, setNewFaq, addFaq, faqs }) {
  return (
    <div style={S.faqSection}>
      <div style={S.faqForm}>
        <h2 style={S.sectionTitle}>Add Auto-Response</h2>
        <label style={S.label}>Question</label>
        <input style={S.input} value={newFaq.question}
          onChange={e => setNewFaq(f => ({ ...f, question: e.target.value }))}
          placeholder="Common learner question…" />
        <label style={{ ...S.label, marginTop: 12 }}>Answer</label>
        <textarea style={S.textarea} value={newFaq.answer}
          onChange={e => setNewFaq(f => ({ ...f, answer: e.target.value }))}
          placeholder="Clear, helpful answer…" rows={4} />
        <button style={S.addFaqBtn} onClick={addFaq}>+ Add FAQ</button>
      </div>

      <div style={S.faqList}>
        <h2 style={S.sectionTitle}>Existing FAQs ({faqs.length})</h2>
        {faqs.length === 0 ? <p style={{ fontSize: 13, color: "#bbb" }}>No FAQs yet</p> :
          faqs.map(f => (
            <div key={f._id} style={S.faqCard}>
              <div style={S.faqQ}>Q: {f.question}</div>
              <div style={S.faqA}>A: {f.answer}</div>
              {f.category && <span style={S.faqCategory}>{f.category}</span>}
            </div>
          ))
        }
      </div>
    </div>
  );
}
