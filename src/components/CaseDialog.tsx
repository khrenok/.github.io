import { useEffect, useRef } from 'react'
import { ArrowUpRight, Check, X } from 'lucide-react'
import type { Project } from '../data'

type Props = { project: Project | null; onClose: () => void }

export default function CaseDialog({ project, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  return (
    <dialog
      ref={ref}
      className="case-dialog"
      aria-labelledby="case-dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        ref.current?.close()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          ref.current?.close()
          onClose()
        }
      }}
    >
      {project && (
        <div className="case-dialog-inner">
          <button className="dialog-close" type="button" aria-label="Закрыть карточку проекта" onClick={() => { ref.current?.close(); onClose() }}>
            <X size={22} aria-hidden="true" />
          </button>
          <span className="case-category">{project.category}</span>
          <h2 id="case-dialog-title">{project.title}</h2>
          <p className="case-dialog-description">{project.description}</p>
          <dl className="case-facts case-facts-dialog">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="dialog-note">
            <Check size={19} aria-hidden="true" />
            <p>Нужен похожий проект? На консультации разберём задачу, ограничения и возможную архитектуру решения.</p>
          </div>
          <a className="button button-primary" href="#contact" onClick={() => { ref.current?.close(); onClose() }}>
            Обсудить похожий проект <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      )}
    </dialog>
  )
}
