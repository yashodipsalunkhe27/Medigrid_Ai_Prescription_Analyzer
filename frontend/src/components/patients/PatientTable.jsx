import { Link } from 'react-router-dom'
import { Eye, History as HistoryIcon } from 'lucide-react'
import DataTable, { Th, Td, Tr } from '../ui/DataTable'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import PatientCard from './PatientCard'
import { initials, timeAgo } from '../../lib/utils'

const RISK_COLOR = { high: 'critical', medium: 'warning', low: 'success' }
const RISK_LABEL = { high: 'High', medium: 'Medium', low: 'Low' }

export default function PatientTable({ patients }) {
  return (
    <>
      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {patients.map((p) => (
          <PatientCard key={p.id} patient={p} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <DataTable>
          <thead>
            <tr>
              <Th>Patient</Th>
              <Th>Last Visit</Th>
              <Th>Prescriptions</Th>
              <Th>Risk</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <Tr key={p.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-semibold">
                      {initials(p.name)}
                    </div>
                    <span className="font-medium truncate">{p.name}</span>
                  </div>
                </Td>
                <Td className="text-muted whitespace-nowrap">{timeAgo(p.lastVisit)}</Td>
                <Td>{p.prescriptions.length}</Td>
                <Td>
                  <Badge color={RISK_COLOR[p.riskLevel]}>{RISK_LABEL[p.riskLevel]}</Badge>
                </Td>
                <Td>
                  <Badge color="success" dot>
                    Active
                  </Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link to={`/patients/${encodeURIComponent(p.id)}`}>
                      <Button variant="icon" aria-label={`View ${p.name}`}>
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link to={`/patients/${encodeURIComponent(p.id)}#history`}>
                      <Button variant="icon" aria-label={`View history for ${p.name}`}>
                        <HistoryIcon size={16} />
                      </Button>
                    </Link>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </>
  )
}
