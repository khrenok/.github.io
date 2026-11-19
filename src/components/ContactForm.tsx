import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, LoaderCircle, Mail } from 'lucide-react'

const FORM_ENDPOINT = 'https://formspree.io/f/mvzjrkgn'
const VALIDATION_ERROR = 'Проверьте обязательные поля: имя — от 2 символов, корректный email и описание задачи — от 10 символов.'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ plan, onPlanChange }: { plan: string; onPlanChange: (plan: string) => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorText, setErrorText] = useState('')

  function handleInvalid() {
    setStatus('error')
    setErrorText(VALIDATION_ERROR)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus('error')
      setErrorText(VALIDATION_ERROR)
      form.reportValidity()
      return
    }

    const data = new FormData(form)
    if (data.get('_gotcha')) {
      setStatus('error')
      setErrorText('Автозаполнение браузера помешало отправке. Обновите страницу, введите данные вручную и попробуйте снова.')
      return
    }

    setStatus('submitting')
    setErrorText('')
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        const message = result?.errors?.map((item: { message?: string }) => item.message).filter(Boolean).join(' ')
        throw new Error(message || 'Сервис не принял заявку. Попробуйте ещё раз или напишите нам на почту.')
      }
      form.reset()
      onPlanChange('')
      setStatus('success')
    } catch (error) {
      setStatus('error')
      if (error instanceof Error && error.name === 'AbortError') {
        setErrorText('Сервис не ответил за 15 секунд. Проверьте соединение и попробуйте отправить заявку ещё раз.')
      } else if (error instanceof TypeError) {
        setErrorText('Не удалось связаться с сервисом отправки. Проверьте интернет или временно отключите блокировщик запросов и повторите попытку.')
      } else {
        setErrorText(error instanceof Error ? error.message : 'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.')
      }
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  return (
    <form className="contact-form" action={FORM_ENDPOINT} method="POST" onSubmit={handleSubmit} onInvalid={handleInvalid} aria-busy={status === 'submitting'}>
      <input type="hidden" name="_subject" value="Новая заявка с сайта NodeTrace" />
      <input className="form-honeypot" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-row">
        <label className="field">
          <span>Ваше имя <b aria-hidden="true">*</b></span>
          <input type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" required minLength={2} onChange={() => status !== 'idle' && setStatus('idle')} />
        </label>
        <label className="field">
          <span>Email <b aria-hidden="true">*</b></span>
          <input type="email" name="email" autoComplete="email" placeholder="name@company.ru" required onChange={() => status !== 'idle' && setStatus('idle')} />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Компания / проект</span>
          <input type="text" name="company" autoComplete="organization" placeholder="Название компании или продукта" />
        </label>
        <label className="field">
          <span>Формат работы</span>
          <select name="tariff" value={plan} onChange={(event) => onPlanChange(event.target.value)}>
            <option value="">Пока не определился</option>
            <option value="Стартапам — от 80 000 ₽">Стартапам — от 80 000 ₽</option>
            <option value="Бизнесу — от 250 000 ₽">Бизнесу — от 250 000 ₽</option>
            <option value="Корпорациям — индивидуально">Корпорациям — индивидуально</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Описание задачи <b aria-hidden="true">*</b></span>
        <textarea name="message" rows={5} required minLength={10} placeholder="Что должно делать устройство, какие есть требования и сроки?" onChange={() => status !== 'idle' && setStatus('idle')} />
      </label>
      {status === 'submitting' && (
        <div className="form-message form-pending" role="status" aria-live="polite">
          <LoaderCircle className="spinner" size={22} aria-hidden="true" />
          <div><strong>Отправляем заявку.</strong><span>Обычно это занимает несколько секунд. Не закрывайте страницу.</span></div>
        </div>
      )}
      {status === 'success' && (
        <div className="form-message form-success" role="status" aria-live="polite">
          <CheckCircle2 size={22} aria-hidden="true" />
          <div><strong>Заявка отправлена.</strong><span>Спасибо! Мы свяжемся с вами в течение 24 часов.</span></div>
        </div>
      )}
      {status === 'error' && (
        <div className="form-message form-error" role="alert">
          <div><strong>Не получилось отправить.</strong><span>{errorText}</span></div>
          <a href="mailto:nodetrace@mail.ru?subject=Заявка%20с%20сайта%20NodeTrace"><Mail size={17} aria-hidden="true" /> Написать на почту</a>
        </div>
      )}
      <div className="form-submit-row">
        <button className="button button-primary button-submit" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? <><LoaderCircle className="spinner" size={19} aria-hidden="true" /> Отправляем…</> : <>Отправить заявку <ArrowUpRight size={19} aria-hidden="true" /></>}
        </button>
        <p>Отправляя форму, вы передаёте нам контакты только для ответа на вашу заявку.</p>
      </div>
    </form>
  )
}
