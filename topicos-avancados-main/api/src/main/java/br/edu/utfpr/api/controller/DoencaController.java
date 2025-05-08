package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.DoencaDTO;
import br.edu.utfpr.api.dto.DoencaResponseDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Doenca;
import br.edu.utfpr.api.repository.CulturaRepository;
import br.edu.utfpr.api.repository.DoencaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@SecurityRequirement(name = "Authorization")
@Tag(name = "Doenças", description = "Todas as doenças que afetam as culturas")
@RequestMapping(value="/doencas", produces = "application/json")
public class DoencaController {

    @Autowired
    private DoencaRepository doencaRepository;

    @Autowired
    private CulturaRepository culturaRepository;

    @Operation(summary = "Obtem doenças", description = "Obtem todas as doenças cadastradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doenças obtidas com sucesso"),
        @ApiResponse(responseCode = "404", description = "Nenhuma doença encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping({""})
    public ResponseEntity<List<DoencaResponseDTO>> getAll(@RequestParam(required = false) Long id) {
        List<Doenca> doencas;

        if (id == null) {
            doencas = doencaRepository.findAllWithCulturas();
        } else {
            doencas = doencaRepository.findByIDWithCulturas(id);
        }

        if (doencas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        List<DoencaResponseDTO> dtos = doencas.stream()
                                             .map(DoencaResponseDTO::new)
                                             .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Obter por id", description = "Obtem uma doença pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doença encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Doença não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DoencaResponseDTO> getById(@PathVariable Long id) {
        Doenca doenca = doencaRepository.findById(id)
                                       .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada"));

        DoencaResponseDTO dto = new DoencaResponseDTO(doenca);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Salvar doença", description = "Salva uma doença nova no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Doença criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos"),
        @ApiResponse(responseCode = "404", description = "Cultura associada não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping({""})
    public ResponseEntity<Doenca> post(@RequestBody @Valid DoencaDTO p) {
        List<Cultura> culturas = p.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Doenca doenca = new Doenca();
        doenca.setNome(p.nome);
        doenca.setSintomas(p.sintomas);
        doenca.setTratamentos(p.tratamentos);
        doenca.setCulturasAfetadas(culturas);
        doenca.setCreationDate(LocalDateTime.now());

        Doenca salva = doencaRepository.save(doenca);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @Operation(summary = "Editar doença", description = "Edita ou altera uma doença no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doença atualizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Doença ou cultura associada não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping({""})
    public ResponseEntity<Doenca> put(@RequestBody @Valid DoencaDTO doencaDTO) {
        Optional<Doenca> doencaExistente = doencaRepository.findById(doencaDTO.id);

        if (doencaExistente.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        List<Cultura> culturas = doencaDTO.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Doenca doenca = doencaExistente.get();
        doenca.setNome(doencaDTO.nome);
        doenca.setSintomas(doencaDTO.sintomas);
        doenca.setTratamentos(doencaDTO.tratamentos);
        doenca.setCulturasAfetadas(culturas);
        doenca.setUpdateDate(LocalDateTime.now());

        Doenca atualizada = doencaRepository.save(doenca);
        return ResponseEntity.ok(atualizada);
    }

    @Operation(summary = "Deleta doença", description = "Deleta uma doença no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doença deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Doença não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable long id) {
        Optional<Doenca> doenca = doencaRepository.findById(id);

        if (doenca.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        doencaRepository.delete(doenca.get());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Doença erradicada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
