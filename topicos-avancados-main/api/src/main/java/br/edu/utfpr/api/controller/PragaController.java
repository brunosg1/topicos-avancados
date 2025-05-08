package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.PragaDTO;
import br.edu.utfpr.api.dto.PragaResponseDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Praga;
import br.edu.utfpr.api.repository.CulturaRepository;
import br.edu.utfpr.api.repository.PragaRepository;
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
@Tag(name = "Pragas", description = "Controle de pragas")
@RequestMapping(value = "/pragas", produces = "application/json")
public class PragaController {

    @Autowired
    private PragaRepository pragaRepository;

    @Autowired
    private CulturaRepository culturaRepository;

    @Operation(summary = "Obtem pragas", description = "Obtem todas as pragas cadastradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pragas obtidas com sucesso"),
        @ApiResponse(responseCode = "404", description = "Nenhuma praga encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping({ "" })
    public ResponseEntity<List<PragaResponseDTO>> getAll(@RequestParam(required = false) Long id) {
        List<Praga> pragas;

        if (id == null) {
            pragas = pragaRepository.findAllWithCulturas();
        } else {
            pragas = pragaRepository.findByIDWithCulturas(id);
        }

        if (pragas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        List<PragaResponseDTO> dtos = pragas.stream()
                .map(PragaResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Obter por id", description = "Obtem uma praga pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Praga encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Praga não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PragaResponseDTO> getById(@PathVariable Long id) {
        Praga praga = pragaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada"));

        PragaResponseDTO dto = new PragaResponseDTO(praga);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Editar praga", description = "Edita ou altera uma praga no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Praga atualizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Praga ou cultura associada não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping({ "" })
    public ResponseEntity<Praga> put(@RequestBody @Valid PragaDTO pragaDTO) {
        Optional<Praga> pragaExistente = pragaRepository.findById(pragaDTO.id);

        if (pragaExistente.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        List<Cultura> culturas = pragaDTO.culturasAfetadas.stream()
                .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
                .collect(Collectors.toList());

        Praga praga = pragaExistente.get();
        praga.setNome(pragaDTO.nome);
        praga.setNomeCientifico(pragaDTO.nomeCientifico);
        praga.setDescricao(pragaDTO.descricao);
        praga.setCulturasAfetadas(culturas);
        praga.setUpdateDate(LocalDateTime.now());

        Praga salva = pragaRepository.save(praga);
        return ResponseEntity.ok(salva);
    }

    @Operation(summary = "Salvar praga", description = "Salva uma praga nova no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Praga criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Cultura associada não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping({ "" })
    public ResponseEntity<Praga> post(@RequestBody @Valid PragaDTO p) {
        List<Cultura> culturas = p.culturasAfetadas.stream()
                .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
                .collect(Collectors.toList());

        Praga praga = new Praga();
        praga.setNome(p.nome);
        praga.setDescricao(p.descricao);
        praga.setNomeCientifico(p.nomeCientifico);
        praga.setCulturasAfetadas(culturas);
        praga.setCreationDate(LocalDateTime.now());

        Praga salva = pragaRepository.save(praga);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @Operation(summary = "Deleta praga", description = "Deleta uma praga no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Praga deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Praga não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable long id) {
        Optional<Praga> praga = pragaRepository.findById(id);

        if (praga.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        pragaRepository.delete(praga.get());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Praga erradicada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
