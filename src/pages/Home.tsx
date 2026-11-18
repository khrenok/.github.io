import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Box,
  CarFront,
  Check,
  ChevronDown,
  CircuitBoard,
  Code2,
  Cpu,
  House,
  Mail,
  Phone,
  Radio,
  ScanLine,
  Send,
  Sprout,
  Watch,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import Header from '../components/Header'
import ContactForm from '../components/ContactForm'
import CaseDialog from '../components/CaseDialog'
import Mascot from '../components/Mascot'
import { plans, process, projects, services, stats, type Project, type ServiceIcon } from '../data'

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  circuit: Zap,
  board: CircuitBoard,
  code: Code2,
  radio: Radio,
  box: Box,
  wrench: Wrench,
}

const projectIcons: Record<string, LucideIcon> = {
  controller: Cpu,
  greenhouse: Sprout,
  cardio: Activity,
  tracker: Watch,
  'smart-home': House,
  scanner: CarFront,
}

const planValues: Record<string, string> = {
  startup: 'Стартапам — от 80 000 ₽',
  business: 'Бизнесу — от 250 000 ₽',
  enterprise: 'Корпорациям — индивидуально',
}

function CircuitBackdrop() {
  return (
    <svg className="circuit-backdrop" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="trace trace-a" d="M-40 160 H210 L270 100 H510 L565 155 H760" />
      <path className="trace trace-b" d="M1440 570 H1190 L1130 510 H940 L880 450 H700" />
      <path className="trace trace-c" d="M90 760 V620 L160 550 V390 L240 310 H355" />
      <path className="trace trace-d" d="M1310 0 V145 L1240 215 V340 L1160 420" />
      <g className="trace-nodes">
        <circle cx="210" cy="160" r="6" /><circle cx="510" cy="100" r="6" />
        <circle cx="1190" cy="570" r="6" /><circle cx="940" cy="510" r="6" />
        <circle cx="160" cy="550" r="6" /><circle cx="1240" cy="215" r="6" />
      </g>
    </svg>
  )
}

function ProjectVisual({ project }: { project: Project }) {
  const Icon = projectIcons[project.id] || CircuitBoard
  return (
    <div className={`project-visual project-visual-${project.id}`} aria-hidden="true">
      <span className="visual-coordinate">NT / {project.category.toUpperCase()}</span>
      <svg className="visual-traces" viewBox="0 0 500 260" preserveAspectRatio="xMidYMid slice">
        <path d="M0 56 H88 L124 92 H202" />
        <path d="M500 204 H390 L350 164 H282" />
        <path d="M54 260 V202 L94 162 V126" />
        <circle cx="88" cy="56" r="5" /><circle cx="390" cy="204" r="5" /><circle cx="94" cy="162" r="5" />
      </svg>
      <Icon className="project-icon" strokeWidth={1.1} />
      <span className="visual-index">{String(projects.findIndex((item) => item.id === project.id) + 1).padStart(2, '0')}</span>
    </div>
  )
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedPlan, setSelectedPlan] = useState('')

  function choosePlan(id: string) {
    setSelectedPlan(planValues[id] || '')
  }

  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержанию</a>
      <Header />
      <main id="main">
        <section className="hero" id="top">
          <CircuitBackdrop />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-status"><span className="status-dot" /> R&amp;D / electronics / firmware</div>
              <h1>Разработка<br />электроники <span>под ключ.</span></h1>
              <p className="hero-description">От идеи до готового устройства: схемы, печатные платы, встраиваемое ПО и промышленный дизайн для стартапов и корпораций.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">Обсудить задачу <ArrowUpRight size={19} aria-hidden="true" /></a>
                <a className="text-link" href="#portfolio">Смотреть проекты <ArrowRight size={18} aria-hidden="true" /></a>
              </div>
              <ul className="hero-capabilities" aria-label="Ключевые компетенции">
                <li><Check size={16} aria-hidden="true" /> Полный цикл</li>
                <li><Check size={16} aria-hidden="true" /> STM32 / ESP32</li>
                <li><Check size={16} aria-hidden="true" /> Прототип → серия</li>
              </ul>
            </div>
            <div className="hero-visual-wrap">
              <div className="hero-visual">
                <div className="console-header">
                  <span>NODETRACE / LAB_01</span>
                  <span className="console-online"><i /> ONLINE</span>
                </div>
                <Mascot />
                <div className="console-output">
                  <span>&gt; idea.compile()</span>
                  <strong>working_device<span className="typing-cursor" aria-hidden="true">_</span></strong>
                </div>
              </div>
              <div className="visual-note visual-note-top"><ScanLine size={16} aria-hidden="true" /> hardware + software</div>
              <div className="visual-note visual-note-bottom"><span>01</span> ваш внешний R&amp;D-отдел</div>
            </div>
          </div>
          <div className="container stats-bar" aria-label="NodeTrace в цифрах">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}<span>{stat.suffix}</span></strong>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container split-layout">
            <div className="section-intro">
              <span className="section-kicker">Компетенции</span>
              <h2>Вся инженерная цепочка в одних руках</h2>
              <p>Не перекладываем стыки между подрядчиками на заказчика. Проектируем устройство как единую систему.</p>
              <a className="text-link text-link-dark" href="#contact">Обсудить компетенции <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <div className="services-list">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.icon]
                return (
                  <details className="service-item" key={service.id} open={index === 0}>
                    <summary>
                      <span className="service-icon"><Icon size={25} strokeWidth={1.7} aria-hidden="true" /></span>
                      <h3>{service.title}</h3>
                      <ChevronDown className="service-chevron" size={22} aria-hidden="true" />
                    </summary>
                    <div className="service-content">
                      <p>{service.summary}</p>
                      <ul>{service.deliverables.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
                      <span className="service-stack">{service.stack}</span>
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <CircuitBackdrop />
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker section-kicker-dark">Как мы работаем</span>
                <h2>Прозрачно на каждом этапе</h2>
              </div>
              <p>Вы понимаете, что происходит с проектом, какое решение принимаем и какой результат получите после каждого этапа.</p>
            </div>
            <ol className="process-list">
              {process.map((step, index) => (
                <li key={step.title}>
                  <span className="process-number">0{index + 1}</span>
                  <div className="process-marker"><i /></div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <strong><Check size={15} aria-hidden="true" /> {step.output}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section portfolio-section" id="portfolio">
          <div className="container">
            <div className="section-heading-row section-heading-row-light">
              <div>
                <span className="section-kicker">Реализованные проекты</span>
                <h2>Техника, которая решает задачи</h2>
              </div>
              <p>От носимых устройств до промышленных контроллеров. Откройте карточку, чтобы увидеть ключевые характеристики.</p>
            </div>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <article className={`project-card ${index === 0 ? 'project-featured' : ''}`} key={project.id}>
                  <ProjectVisual project={project} />
                  <div className="project-copy">
                    <span className="case-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <dl className="case-facts">
                      {project.facts.slice(0, index === 0 ? 3 : 2).map((fact) => (
                        <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
                      ))}
                    </dl>
                    <button className="case-open" type="button" onClick={() => setSelectedProject(project)} aria-label={`Подробнее о проекте «${project.title}»`}>
                      Подробнее <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <div className="container">
            <div className="pricing-intro">
              <div>
                <span className="section-kicker section-kicker-dark">Форматы работы</span>
                <h2>Понятная точка старта.<br />Честный объём работ.</h2>
              </div>
              <p>Финальная смета зависит от требований и компонентной базы. До начала работ фиксируем состав, сроки и стоимость этапа.</p>
            </div>
            <div className="pricing-list">
              {plans.map((plan) => (
                <article className={`plan-row ${plan.featured ? 'plan-featured' : ''}`} key={plan.id}>
                  <div className="plan-heading">
                    <span>{plan.audience}{plan.featured && <b>Чаще выбирают</b>}</span>
                    <h3>{plan.title}</h3>
                  </div>
                  <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
                  <div className="plan-action">
                    <strong>{plan.price}</strong>
                    <a href="#contact" onClick={() => choosePlan(plan.id)} aria-label={`Обсудить тариф «${plan.audience}»`}>Обсудить <ArrowUpRight size={18} aria-hidden="true" /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <span className="section-kicker section-kicker-dark">Обсудить проект</span>
              <h2>Есть задача?<br /><span>Давайте разберём.</span></h2>
              <p>Расскажите о продукте и ограничениях — мы подготовим оценку и предложим решение в течение 24 часов.</p>
              <div className="contact-methods">
                <a href="mailto:nodetrace@mail.ru"><Mail size={21} aria-hidden="true" /><span><small>Почта</small>nodetrace@mail.ru</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="https://t.me/NodeTrace1" target="_blank" rel="noopener noreferrer"><Send size={21} aria-hidden="true" /><span><small>Telegram</small>@NodeTrace1</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="tel:+79138172429"><Phone size={21} aria-hidden="true" /><span><small>Телефон</small>+7 (913) 817-24-29</span><ArrowUpRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
            <ContactForm plan={selectedPlan} onPlanChange={setSelectedPlan} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <a className="footer-email" href="mailto:nodetrace@mail.ru">nodetrace@mail.ru <ArrowUpRight aria-hidden="true" /></a>
          <div className="footer-main">
            <a className="brand footer-brand" href="#top" aria-label="NodeTrace — наверх">
              <img src="./images/logo-mark.webp" width="48" height="48" alt="" />
              <span className="brand-copy"><strong>NodeTrace</strong><small>От идеи до работающего устройства</small></span>
            </a>
            <nav className="footer-nav" aria-label="Навигация в подвале">
              <a href="#services">Услуги</a><a href="#process">Процесс</a><a href="#portfolio">Проекты</a><a href="#pricing">Тарифы</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} NodeTrace. Все права защищены.</span>
            <span>Схемы / Платы / Firmware / IoT</span>
          </div>
        </div>
      </footer>
      <CaseDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
